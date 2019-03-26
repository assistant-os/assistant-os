import EventEmitter from 'events'

/**
 * Represents an object in communication with the assistant
 */
export default class Node extends EventEmitter {
  constructor ({
    label = 'unknown',
    priority = 0,
    type = 'unknown',
    port,
    host,
    token,
  }) {
    super()
    this.label = label
    this.priority = priority
    this.type = type
    this.port = port
    this.host = host
    this.token = token
  }

  start () {
    this.register()
  }

  register () {}
}
