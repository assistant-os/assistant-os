import Module from 'nodes/libs/module'

import 'config/env'

export default class extends Module {
  constructor (props) {
    super({ label: 'hello', ...props })
  }

  evaluateProbability (message /* , user */) {
    return new Promise((resolve, reject) => {
      if (message === 'hello') {
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
