import io from 'socket.io-client'
import Node from './node'

/**
 * Represents an object in communication with the assistant
 */
export default class WebSocketNode extends Node {
  constructor (props) {
    super(props)
  }

  register () {
    this.socket = io(`${this.host}:${this.port}`)

    this.socket.on('connect', () => {
      this.socket.emit('message', {
        token: this.token,
        type: 'register',
        payload: {
          label: this.label,
          priority: this.priority,
          type: this.type
        }
      })
    })

    this.socket.on('message', message => {
      if (message.type === 'registered') {
        this.emit('registered')
      }
      this.emit('message', message)
    })
  }
}
