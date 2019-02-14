import EventEmitter from 'events'

import express from 'express'
import http from 'http'
import socketIo from 'socket.io'

/**
 * Manage nodes
 */
export default class Nexus extends EventEmitter {
  constructor ({ port = 8080, token = null, logger = null } = {}) {
    super()
    this.port = port // default port
    this.sockets = {}
    this.nodes = {}
    this.token = token
    this.logger = logger
  }

  check (callback) {
    return data => {
      if (
        data &&
        typeof data === 'object' &&
        'token' in data &&
        data.token === this.token
      ) {
        callback && callback(data)
      }
    }
  }

  send ({ id, ...other }) {
    if (id in this.nodes) {
      this.nodes[id].socket.emit('message', { ...other })
    }
  }

  start () {
    if (!this.token) {
      this.emit('error', { reason: 'token-not-valid', details: this.token })
      return
    }

    this.http = express()
    this.server = http.Server(this.http)
    this.io = socketIo(this.server)

    this.server.listen(this.port, () => {
      this.emit('info', `listening on port ${this.port}`)
    })

    this.io.on('connection', socket => {
      let id = null
      socket.on(
        'message',
        this.check(({ type, payload }) => {
          if (type === 'register') {
            id = Math.floor(Math.random() * Math.floor(1000000))
            // register the socket
            this.nodes[id] = {
              ...payload,
              socket
            }
          }
          this.emit('node', { id, type, payload })
        })
      )

      socket.on('disconnect', () => {
        delete this.nodes[id]
        this.emit('node', {
          type: 'unregister',
          id
        })
      })
    })
  }
}
