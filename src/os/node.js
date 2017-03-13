import EventEmitter from 'events'

class Node extends EventEmitter {

    constructor (opts) {
        this.id = opts.id
        this.token = opts.token
        this.name = opts.name
        this.description = opts.description
        this.status = 'disconnected'
    }

    isConnected () {
        return this.status === 'connected'
    }

    connect () {
        this.status = 'connected'
        this.emit('connected')
    }

    disconnect () {
        this.status = 'disconnected'
        this.emit('disconnected')
    }

    process (message) {

    }
}
