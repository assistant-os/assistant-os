import EventEmitter from 'events'

export default class Adapter extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
  }

  start() {
    throw new Error('Not implemented')
  }

  stop() {
    throw new Error('Not implemented')
  }

  async sendMessage(/* adapterUserId, message */) {
    throw new Error('Not implemented')
  }

  async sendAction(/* adapterUserId, action */) {
    throw new Error('Not implemented')
  }
}
