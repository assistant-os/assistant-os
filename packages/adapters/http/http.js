import Server from 'socket.io'
import uuidv1 from 'uuid/v1'

import { Adapter, Users, logger } from '@assistant-os/common'

const secure = callback => {
  return ({ secret, ...data }) => {
    if (secret === process.env.ADAPTER_HTTP_SECRET) {
      callback && callback(data)
    }
  }
}

export default class Http extends Adapter {
  constructor() {
    super('http')

    this.users = new Users(this.name)

    this.sockets = {}
  }

  start() {
    return new Promise(resolve => {
      this.io = new Server(process.env.ADAPTER_HTTP_PORT)

      this.io.on('connection', socket => {
        socket.on(
          'start',
          secure(({ token }) => {
            this.sockets[token] = socket
          })
        )

        socket.on(
          'message',
          secure(({ token, text }) => {
            const user = this.users.findOrCreateByAdapter(token)
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

    if (this.sockets[user.adapter.id]) {
      this.sockets[user.adapter.id].emit('message', message)
    } else {
      logger.error('impossible to send message on http')
    }
  }
}
