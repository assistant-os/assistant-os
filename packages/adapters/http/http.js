import Server from 'socket.io'
import uuidv1 from 'uuid/v1'

import { Adapter, logger } from '@assistant-os/common'

import Sockets from './sockets'

const TIMEOUT = 5000

export default class Http extends Adapter {
  constructor() {
    super('http')
  }

  secure(callback) {
    return ({ secret, token, ...data }) => {
      if (secret === process.env.ADAPTER_HTTP_SECRET) {
        const user = this.users.findOrCreateByAdapter(token)
        console.log('token', token, user.adapter.id)
        callback && callback(user, data)
      }
    }
  }

  start() {
    return new Promise(resolve => {
      this.io = new Server(process.env.ADAPTER_HTTP_PORT)

      this.io.on('connection', socket => {
        socket.on(
          'start',
          this.secure(user => {
            console.log('start', user.adapter.id)
            Sockets.add(user, socket)
            clearInterval(waitForStart)
            socket.emit('started')
          })
        )

        socket.on(
          'message',
          this.secure((user, message) => {
            console.log('message', message, user.adapter.id)
            this.emit('message', {
              userId: user.id,
              id: uuidv1(),
              ...message,
            })
          })
        )

        const waitForStart = setTimeout(() => socket.disconnect(), TIMEOUT)
      })
      resolve()
    })
  }

  stop() {}

  async sendMessage(userId, message) {
    const user = this.users.findById(userId)
    if (Sockets.get(user)) {
      Sockets.get(user).emit('message', message)
    } else {
      logger.error('impossible to send message on http')
    }
  }
}
