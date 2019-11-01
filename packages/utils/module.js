import EventEmitter from 'events'

export default class Module extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
    this.context = {}
  }

  start() {
    throw new Error('Not implemented')
  }

  hasStatus(userId, state) {
    return userId in this.context && this.context[userId].status === state
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
}
