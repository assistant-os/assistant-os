import { WebSocketModule } from '@assistant-os/utils'

export default class extends WebSocketModule {
  constructor (props) {
    super({ label: 'prototype', ...props })
  }

  evaluateProbability ({ format, content /* , user */ }) {
    return new Promise((resolve, reject) => {
      if (format === 'text') {
        if (content === 'prototype notification') {
          resolve(1)
        }
      }

      resolve(0)
    })
  }

  answer ({ format, content }) {
    return new Promise(resolve => {
      if (format === 'text') {
        if (content === 'prototype notification') {
          setTimeout(() => {
            resolve({
              format: 'text',
              content: 'I notify you !',
            })
          }, 10000)
        }
        return
      }

      reject()
    })
  }
}
