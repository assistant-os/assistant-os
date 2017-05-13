import EventEmitter from 'events'
import socketIo from 'socket.io'

class Nexus extends EventEmitter {
    constructor (opts) {
        super()
        this.port = 8080
        this.nodes = []

        if (opts) {
            if (opts.port) {
                this.port = opts.port
            }

            if (opts.nodes) {
                this.nodes = opts.nodes
            }
        }

    }

    // format data from socket.io in order to find node sending the request
    format (callback) {
        return (data) => {
            if (data && typeof data === 'object' && data.hasOwnProperty('token')) {
                for (let node of this.nodes) {
                    if (node.token === data.token) {
                        callback && callback (node, data)
                        return
                    }
                }
            }
        }
    }

    send (node, request, data) {
      for (const socket in io.sockets.sockets) {
        if (socket.node === node) {
          socket.emit(request, data)
        }
      }
    }

    getNode (nodeName) {
      for (const node of this.nodes) {
        if (node.name === nodeName) {
          return node
        }
      }
      return null
    }

    start () {
      for (const node of this.nodes) {
        node.nexus = this
      }


        this.io = socketIo(this.port)
        this.io.on('connection', (socket) => {

            socket.on('hello', this.format((node, data) => {
              socket.node = node
                node.connect()

                let behaviors = []
                for (let behavior of node.behaviors) {
                    behaviors.push({
                        type: behavior.type,
                        device: behavior.device
                    })
                }

                socket.emit('set-behavior', behaviors)
            }))

            socket.on('behavior-result', this.format((node, data) => {
                for (let behavior of node.behaviors) {
                    if (behavior.type === data.type) {
                        behavior.callback && behavior.callback(data.payload)
                    }
                }
            }))

            // socket.on('')

            socket.on('disconnect', () => {
                if (socket.node) {
                    socket.node.disconnect()
                }
            })
        })
    }
}

export default Nexus
