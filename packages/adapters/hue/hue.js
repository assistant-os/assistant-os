import EventEmitter from 'events'
import { v3 } from 'node-hue-api'
import { config, logger } from '@assistant-os/common'

const {
  api: hueApi,
  discovery,
  lightStates: { GroupLightState },
} = v3

const discoverBridgeAddress = async () => {
  const discoveryResults = await discovery.nupnpSearch()

  if (discoveryResults.length === 0) {
    if (config.get('HUE_HUB_IP_ADDRESS')) {
      return config.get('HUE_HUB_IP_ADDRESS')
    }
    throw new Error('Failed to resolve any Hue Bridges')
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return discoveryResults[0].ipaddress
  }
}

const createUser = async ipAddress => {
  try {
    const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect()

    return await unauthenticatedApi.users.createUser(
      config.get('APP_NAME'),
      config.get('HOME_NAME')
    )
  } catch (error) {
    if (
      typeof error.getHueErrorType === 'function' &&
      error.getHueErrorType() === 101
    ) {
      throw new Error(
        'The Link button on the bridge was not pressed. Please press the Link button and try again.'
      )
    } else {
      throw error
    }
  }
}

const HUE_MOTION = 'Hue motion '
const isMotionDetector = sensor => sensor.type === 'ZLLPresence'

class Hue extends EventEmitter {
  interval = null
  sensorsStates = {}

  async homeInfo() {
    const bridge = await this.api.configuration.getConfiguration()

    const rooms = await this.api.groups.getRooms()

    return {
      home: {
        name: bridge.name,
        rooms,
      },
    }
  }

  async start() {
    const ipAddress = await discoverBridgeAddress()

    if (!config.get('hue_username')) {
      const { username, clientkey } = await createUser(ipAddress)

      config.set('hue_username', username)
      config.set('hue_clientkey', clientkey)

      config.save()
    }

    this.api = await hueApi
      .createLocal(ipAddress)
      .connect(config.get('hue_username'))

    logger.verbose('hue communication started')

    if (this.interval) {
      clearInterval(this.interval)
    }

    this.interval = setInterval(() => {
      this.checkSensors()
    }, parseInt(config.get('HUE_HUE_INTERVAL')) || 1000)
  }

  async switchLight(roomName, on = true) {
    const groups = await this.api.groups.getGroupByName(roomName)

    if (groups.length > 0) {
      const newLightState = new GroupLightState().on(on)

      const room = groups[0]

      await this.api.groups.setGroupState(room.id, newLightState)
    } else {
      const groups = await this.api.groups.getRooms()

      throw new Error(
        `no room with name ${roomName}. Available roomes are ${groups
          .map(g => g.name)
          .join(',')}`
      )
    }
  }

  async setScene(roomName, sceneName) {
    const groups = await this.api.groups.getGroupByName(roomName)

    const scenes = await this.api.scenes.getSceneByName(sceneName)

    if (groups.length > 0 && scenes.length > 0) {
      const scene = scenes[0]

      const newLightState = new GroupLightState().scene(scene.id)

      const room = groups[0]

      await this.api.groups.setGroupState(room.id, newLightState)
    } else {
      const groups = await this.api.groups.getRooms()

      throw new Error(
        `no room with name ${roomName}. Available roomes are ${groups
          .map(g => g.name)
          .join(',')}`
      )
    }
  }

  async execute(query) {
    const matchSwitch = query.match(/switch (on|off) lights in the (.*)/)

    if (matchSwitch) {
      const [, status, room] = matchSwitch

      await this.switchLight(room, status === 'on')

      return
    }

    const matchSetScene = query.match(/set scene (.*) in the (.*)/)

    if (matchSetScene) {
      const [, scene, room] = matchSetScene

      await this.setScene(room, scene)

      return
    }
  }

  statusChanged(sensor) {
    return sensor.lastupdated !== this.sensorsStates[sensor.id]?.lastupdated
  }

  async checkSensors() {
    const sensors = await this.api.sensors.getAll()

    sensors.forEach(sensor => {
      if (isMotionDetector(sensor)) {
        const { name, presence, lastupdated } = sensor
        const roomName = name
          .replace(HUE_MOTION, '')
          .replace(/[0-9]+/, '')
          .trim()

        if (presence && this.statusChanged(sensor)) {
          logger.verbose('detect-person-in-room', {
            sensor: {
              name: sensor.name,
              lastupdated: sensor.lastupdated,
              type: sensor.type,
              roomName,
            },
          })
          this.emit('detect-person-in-room', { roomName })
        }

        this.sensorsStates[sensor.id] = {
          name,
          presence,
          lastupdated,
        }
      }
    })
  }
}

export default new Hue()
