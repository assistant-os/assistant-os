import { Module, getASynonym } from '@assistant-os/utils'
import * as Message from '@assistant-os/utils/message'

export default class Hello extends Module {
  constructor() {
    super('hello')
  }

  start() {}
  stop() {}

  evaluateProbability(message) {
    return new Promise(resolve => {
      if (Message.isCloseTo(message, 'hello')) {
        resolve(1)
        return
      }

      resolve(0)
    })
  }

  respond(message) {
    const context = this.getContext(message)

    context.sendTextMessage(`${getASynonym('hello')}!`)
  }
}
