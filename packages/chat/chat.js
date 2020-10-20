import EventEmitter from 'events'
import { logger } from '@assistant-os/common'

class Chat extends EventEmitter {
  constructor() {
    super()
    this.adapters = []
  }

  start() {
    this.adapters.forEach(adapter => {
      adapter.on('message', data => {
        logger.info('message', { text: data.text, from: adapter.name })
        this.emit('message', { ...data, adapter })
      })
    })
  }

  async speak(message, user = { admin: true }) {
    const mess = typeof message === 'string' ? { text: message } : message

    if (this.adapters.length > 0) {
      this.adapters[0].speak(mess, user)
    }
  }

  async prompt() {}
}

const chat = new Chat()

export default chat
