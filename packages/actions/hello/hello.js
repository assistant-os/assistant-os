import { Action, getASynonym, Message, Users } from '@assistant-os/common'

export default class Hello extends Action {
  constructor() {
    super('hello')

    this.users = new Users()
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

  respond(message, userId) {
    const context = this.getContext(message)

    const user = this.users.findById(userId)

    context.sendTextMessage(`${getASynonym('hello')}!`)

    // if (user.name)
  }
}
