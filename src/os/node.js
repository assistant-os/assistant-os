import EventEmitter from 'events'

class Node extends EventEmitter {

    constructor (opts) {
        super()
        this.id = opts.id
        this.token = opts.token
        this.name = opts.name
        this.description = opts.description
        this.status = 'disconnected'
        this.owner = null
        this.behaviors = opts.behaviors
        this.nexus = null
    }

    isConnected () {
        return this.status === 'connected'
    }

    connect () {
        let previousStatus = this.status
        this.status = 'connected'
        if (previousStatus !== this.status) {
            this.emit('connected')
        }
    }

    send (request, data) {
      if (this.nexus) {
        this.nexus.send(this, request, data)
      }
    }

    disconnect () {
        let previousStatus = this.status
        this.status = 'disconnected'
        if (previousStatus !== this.status) {
            this.emit('disconnected')
        }
    }

    process (message) {

    }

    belongsTo (user) {
        this.owner = user
    }
}

export default Node
