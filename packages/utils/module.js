import EventEmitter from 'events'

export default class Module extends EventEmitter {
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

  async evaluateProbability(/* message */) {
    throw new Error('Not implemented')
  }

  async respond(/* message */) {
    throw new Error('Not implemented')
  }
}
