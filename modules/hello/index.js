import { JaroWinklerDistance } from 'natural'
import { WebSocketModule } from '@assistant-os/utils'

import config from './config'

export default class extends WebSocketModule {
  constructor (props) {
    super({ label: 'hello', ...props })
  }

  evaluateProbability (message /* , user */) {
    return new Promise((resolve, reject) => {
      const distance = JaroWinklerDistance(message, 'hello')
      if (distance > config.minimal_distance) {
        resolve(1)
        return
      }

      resolve(0)
    })
  }

  answer (/* data */) {
    return new Promise(resolve => {
      resolve({
        type: 'text',
        text: 'Hello !',
      })
    })
  }
}
