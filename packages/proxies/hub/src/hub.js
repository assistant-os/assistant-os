import EventEmitter from 'events'
import { Home, Room } from '@assistant-os/domains-home'
import { config, logger } from '@assistant-os/common'

class Hub extends EventEmitter {
  constructor() {
    super()

    this.adapters = []
    this.home = null
  }

  async setupHome({ home }) {
    if (home) {
      const { name, location, rooms } = home
      if (name) {
        this.home.name = name
      }

      if (location) {
        this.home.location = location
      }

      if (rooms) {
        rooms.forEach(r => {
          const room = new Room(r.name)
          this.home.add(room)
        })
      }
    }
  }

  async start() {
    this.home = new Home()

    const promises = this.adapters.map(async adapter => {
      adapter.on('detect-person-in-room', ({ roomName }) => {
        const room = this.home.findRoomByName(roomName)
        this.home.detectPersonInRoom(room)
      })

      this.setupHome(await adapter.homeInfo())
    })

    return Promise.all(promises)
  }

  async execute(query) {
    this.adapters.forEach(adapter => {
      adapter.execute(query)
    })
  }
}

const hub = new Hub()

export default hub
