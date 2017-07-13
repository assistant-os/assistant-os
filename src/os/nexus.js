import EventEmitter from 'events'

import express from 'express'
import http from 'http'
import socketIo from 'socket.io'

/**
 * Manage nodes
 */
export default class Nexus extends EventEmitter {
  constructor ({ port = 8080, nodes = [], routers = {} }) {
    super()
    this.port = port // default port
    this.nodes = nodes
    this.sockets = {}

    this.routers = routers
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
    if (this.sockets[node.name]) {
      this.sockets[node.name].emit(request, data)
      console.log('socket.emit', request)
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

    this.http = express()
    this.server = http.Server(this.http)
    this.io = socketIo(this.server)

    // for (const key in this.routers) {
    //   this.app.use(key, this.routers[key])
    // }

    this.server.listen(this.port)


    this.io.on('connection', (socket) => {

      socket.on('hello', this.format((node, data) => {
        socket.node = node
        this.sockets[node.name] = socket
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
          delete this.sockets[socket.node.name]
        }
      })
    })
  }
}
