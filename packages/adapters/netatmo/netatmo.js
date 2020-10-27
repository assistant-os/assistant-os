import EventEmitter from 'events'

import axios from 'axios'
import qs from 'qs'
import { config, logger } from '@assistant-os/common'

const baseUrlAuth = 'https://api.netatmo.net'
const baseURL = 'https://api.netatmo.net/api'

const instance = axios.create({
  baseURL,
})

const form = params => qs.stringify(params)

class Netamo extends EventEmitter {
  access_token = ''
  status = null

  start() {
    const auth = {
      client_id: config.get('NETAMO_CLIENT_ID'),
      client_secret: config.get('NETAMO_CLIENT_SECRET'),
      username: config.get('NETAMO_USERNAME'),
      password: config.get('NETAMO_PASSWORD'),
    }

    return axios
      .post(
        '/oauth2/token',
        form({ grant_type: 'password', scope: 'read_camera', ...auth }),
        {
          baseURL: baseUrlAuth,
        }
      )
      .then(({ data }) => {
        this.access_token = data.access_token
      })
      .then(() => {
        return instance
          .get('/gethomedata', { params: { access_token: this.access_token } })
          .then(({ data }) => {
            const home = data.body.homes.find(
              home => home.name === config.get('HOME_NAME')
            )

            if (home) {
              this.status = home
            } else {
              logger.error('impossible to find home', {
                homes: data.body.homes,
              })
            }
          })
      })
  }
}

export default new Netamo()
