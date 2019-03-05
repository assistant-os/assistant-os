import io from 'socket.io-client'
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

  start () {
    this.register()
  }

  register () {
    this.socket = io(`${this.host}:${this.port}`)

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
      this.emit('data', message)
      // this.emit(`test-${message.type}`, message)
    })
  }
}
