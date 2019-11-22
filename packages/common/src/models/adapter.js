import EventEmitter from 'events'
import Users from '../services/users'

export default class Adapter extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
    this.users = new Users(this.name)
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

  async sendAction(/* adapterUserId, action */) {}
}
