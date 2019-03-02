import EventEmitter from 'events'

import express from 'express'
import http from 'http'
import socketIo from 'socket.io'

/**
 * Manage nodes
 */
export default class Nexus extends EventEmitter {
  constructor ({
    port = process.env.PORT || 8080,
    token = process.env.TOKEN || null,
  } = {}) {
    super()
    this.port = port
    this.sockets = {}
    this.nodes = {}
    this.token = token
  }

  checkToken (callback) {
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

  send ({ id, group, ...other }) {
    if (id && id in this.nodes) {
      this.nodes[id].socket.emit('message', { ...other })
    } else if (group) {
      Object.keys(this.nodes).forEach(id => {
        if (this.nodes[id].type === group) {
          this.nodes[id].socket.emit('message', { ...other })
        }
      })
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
      let userId = null
      let adapterId = null
      socket.on(
        'message',
        this.checkToken(({ type, payload }) => {
          if (type === 'register') {
            adapterId = Math.floor(Math.random() * Math.floor(1000000))
            userId = Math.floor(Math.random() * Math.floor(1000000))

            // register the socket
            this.nodes[adapterId] = {
              id: adapterId,
              ...payload,
              socket,
            }
          }
          this.emit('node', {
            id: adapterId,
            type,
            payload: { ...payload, user: { id: userId } },
          })
        })
      )

      socket.on('disconnect', () => {
        delete this.nodes[adapterId]
        this.emit('node', {
          type: 'unregister',
          id: adapterId,
        })
      })
    })
  }
}
