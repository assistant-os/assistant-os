import EventEmitter from 'events'

import { config, logger } from '@assistant-os/common'
import SpotifyWebApi from 'spotify-web-api-node'

class Spotify extends EventEmitter {
  start() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: config.get('SPOTIFY_CLIENT_ID'),
      clientSecret: config.get('SPOTIFY_CLIENT_SECRET'),
    })

    return new Promise((resolve, reject) => {
      // cf https://github.com/thelinmichael/spotify-web-api-node#client-credential-flow
      this.spotifyApi.clientCredentialsGrant().then(
        ({ body }) => {
          const { access_token } = body
          this.spotifyApi.setAccessToken(access_token)

          logger.verbose('spotify communication established', { access_token })
          resolve()
        },
        error => {
          logger.error('fail to start spotify communication', { error })
          reject()
        }
      )
    })
  }

  async getMyDevices() {
    return new Promise((resolve, reject) => {
      this.spotifyApi.getMyDevices().then(
        ({ body }) => {
          const { devices } = body
          resolve(devices)
        },
        error => {
          reject(error)
        }
      )
    })
  }

  async execute(query) {
    const matchSwitch = query.match(/spotify devices/)
    if (matchSwitch) {
      const devices = await this.getMyDevices()

      logger.info('spotify devices', { devices })
      return
    }

    // const matchSwitch = query.match(/switch (on|off) lights in the (.*)/)
    // if (matchSwitch) {
    //   const [, status, room] = matchSwitch
    //   await this.switchLight(room, status === 'on')
    //   return
    // }
    // const matchSetScene = query.match(/set scene (.*) in the (.*)/)
    // if (matchSetScene) {
    //   const [, scene, room] = matchSetScene
    //   await this.setScene(room, scene)
    //   return
    // }
  }
}

export default new Spotify()
