import EventEmitter from 'events'

import profile from 'config/profile'

/**
 * The OS
 */
export default class Os extends EventEmitter {
  constructor ({ name }) {
    super()
    this.adapters = []
    this.nodes = []
    this.identity = {
      ...profile,
      name
    }
    this.context = null
  }

  processMessage ({ id, type, payload }) {
    if (type === 'register') {
      const { type, label } = payload
      this.nodes.push({ id, ...payload })
      this.emit('info', `${type} ${label} registered`)
      this.emit('node', { type: 'registered', id })
    } else if (type === 'unregister') {
      const index = this.nodes.findIndex(node => node.id === id)
      const { type } = this.nodes[index]
      this.nodes.splice(index, 1)
      this.emit('info', `${type} ${id} unregistered`)
    } else if (type === 'message') {
      this.emit('info', `new message "${payload.content}"`)
    }
  }

  start () {
    this.emit('info', `${this.identity.name} started`)
  }
}
