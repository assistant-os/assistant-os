import io from 'socket.io-client'
import { logger } from '@assistant-os/utils'
import Node from './node'

/**
 * Represents an object in communication with the assistant
 */
export default class WebSocketNode extends Node {
  constructor (props) {
    super(props)
  }

  send (type, payload) {
    this.socket.emit('data', { token: this.token, type, payload })
  }

  sendMemory (memory) {
    this.socket.emit('data', {
      token: this.token,
      type: 'set-memory',
      payload: memory,
    })
  }

  processAction () {}

  start () {
    this.register()
  }

  register () {
    this.socket = io(`${this.host}:${this.port}`)

    logger.plug(this.socket)

    this.socket.on('connect', () => {
      this.send('register', {
        label: this.label,
        priority: this.priority,
        type: this.type,
      })
    })

    this.socket.on('data', message => {
      if (message.type === 'registered') {
        this.emit('registered')
      }

      if (message.type === 'process-action') {
        this.processAction(message.payload)
      }
      this.emit('data', message)
      // this.emit(`test-${message.type}`, message)
    })
  }
}
