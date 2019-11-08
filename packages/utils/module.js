import EventEmitter from 'events'

import Context from './context'

export default class Module extends EventEmitter {
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
}
