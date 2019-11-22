import { Action, getASynonym, Message } from '@assistant-os/common'

export default class Hello extends Action {
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
