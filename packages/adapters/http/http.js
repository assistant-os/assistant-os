import Server from 'socket.io'
import uuidv1 from 'uuid/v1'

import { Adapter, logger } from '@assistant-os/common'

import Sockets from './sockets'

export default class Http extends Adapter {
  constructor() {
    super('http')
  }

  secure(callback) {
    return ({ secret, token, ...data }) => {
      if (secret === process.env.ADAPTER_HTTP_SECRET) {
        const user = this.users.findOrCreateByAdapter(token)
        callback && callback(user, data)
      }
    }
  }

  start() {
    return new Promise(resolve => {
      this.io = new Server(process.env.ADAPTER_HTTP_PORT)

      this.io.on('connection', socket => {
        socket.on('start', this.secure(user => Sockets.add(user, socket)))

        socket.on(
          'message',
          this.secure((user, { text }) => {
            this.emit('message', {
              userId: user.id,
              id: uuidv1(),
              text: text,
            })
          })
        )
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
