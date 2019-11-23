import EventEmitter from 'events'

import Context from '../utils/context'

export default class Action extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
    this.globalContext = {}
  }

  start() {
    throw new Error('Not implemented')
  }

  stop() {
    throw new Error('Not implemented')
  }

  async evaluateProbability(/* message */) {
    throw new Error('Not implemented')
  }

  async respond(/* message */) {
    throw new Error('Not implemented')
  }

  getContext(message, userId = null) {
    return new Context(this, userId, message)
  }

  sendMessage(message, meta = {}) {
    this.emit('message', {
      ...message,
      ...meta,
    })
  }

  forgetStatus(userId) {
    if (userId in this.globalContext) {
      this.globalContext[userId].status = null
    }
  }
}
