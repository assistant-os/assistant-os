import Server from 'socket.io'
import uuidv1 from 'uuid/v1'

import { Adapter, logger } from '@assistant-os/common'

import * as sockets from './sockets'
import * as credentials from './credantials'

const TIMEOUT = 5000

export default class Http extends Adapter {
  constructor() {
    super('http')

    this.secret = ''
  }

  when(socket, eventName, callback) {
    socket.on(eventName, ({ secret, token, ...data }) => {
      if (secret === this.secret) {
        const user = this.users.findOrCreateByAdapter(token)
        callback && callback(user, data)
      }
    })
  }

  async start() {
    return new Promise(async resolve => {
      credentials.setup()
      this.secret = await credentials.getSecret()
      this.port = process.env.ADAPTER_HTTP_PORT

      this.io = new Server(this.port)

      logger.info(`starting sever on ws://localhost:${this.port}`)

      this.io.on('connection', socket => {
        this.when(socket, 'start', user => {
          sockets.add(socket, user)
          clearTimeout(waitForStart)
          socket.emit('started')
        })

        this.when(socket, 'message', (user, data) => {
          this.emit('message', {
            userId: user.id,
            id: uuidv1(),
            ...data,
          })
        })

        const waitForStart = setTimeout(() => socket.disconnect(), TIMEOUT)
      })
      resolve()
    })
  }

  stop() {}

  async sendMessage(message) {
    const user = this.users.findById(message.userId)
    const socket = sockets.find(user)
    if (socket) {
      socket.emit('message', message)
    } else {
      logger.error('impossible to send message on http')
    }
  }
}
