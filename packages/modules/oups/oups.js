import { Module } from '@assistant-os/utils'

export default class Oups extends Module {
  constructor() {
    super('oups')
  }

  start() {}
  stop() {}

  evaluateProbability(/* message */) {
    return Promise.resolve(0.1)
  }

  respond(message) {
    this.emit('message', {
      text: `Sorry I don't understand your request.`,
      previousMessage: message.id,
    })
  }
}
