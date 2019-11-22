import { Action, getASynonym, Message, Users } from '@assistant-os/common'

const READY_TO_SET_NAME = 'ready-to-set-name'
const READY_TO_CONFIRM = 'ready-to-confirm'

export default class Hello extends Action {
  constructor() {
    super('hello')

    this.users = new Users()
  }

  start() {}
  stop() {}

  evaluateProbability(message) {
    return new Promise(resolve => {
      const context = this.getContext(message)
      if (context.hasStatus(READY_TO_SET_NAME)) {
        resolve(1)
        return
      }

      if (
        context.hasStatus(READY_TO_CONFIRM) &&
        (Message.isConfirm(message) || Message.isCancel(message))
      ) {
        resolve(1)
        return
      }

      if (Message.isCloseTo(message, 'hello')) {
        resolve(1)
        return
      }

      resolve(0)
    })
  }

  async respond(message, userId) {
    const context = this.getContext(message)

    if (context.hasStatus(READY_TO_SET_NAME) && message.text) {
      context.sendTextMessage(`So you confirm your name is "${message.text}"?`)
      context.setStatus(READY_TO_CONFIRM, { name: message.text })
      return
    }

    if (
      context.hasStatus(READY_TO_CONFIRM) &&
      (Message.isConfirm(message) || Message.isCancel(message))
    ) {
      context.sendTextMessage(`${getASynonym('ok')}!`)
      this.users.update(userId, { name: context.get('name') })
      context.setDefaultStatus()
      return
    }

    let user = this.users.findById(userId)

    if (user.name === 'unknown') {
      context.sendTextMessage(`${getASynonym('hello')}!`)
      await new Promise(resolve => setTimeout(() => resolve(), 1000))
      context.sendTextMessage('What is your name?')
      context.setStatus(READY_TO_SET_NAME)
    } else {
      context.sendTextMessage(`${getASynonym('hello')} ${user.name}!`)
    }
  }
}
