import * as Message from './message'

export default class Context {
  constructor(module, userId, message = {}) {
    this.globalContext = module.globalContext
    this.userId = userId
    this.message = message
    this.module = module
  }

  hasStatus(status) {
    return (
      this.userId in this.globalContext &&
      this.globalContext[this.userId].status === status
    )
  }

  setStatus(status, meta = {}) {
    this.globalContext[this.userId] = {
      ...this.globalContext[this.userId],
      ...meta,
      status,
    }
  }

  setDefaultStatus() {
    this.setStatus(null)
  }

  sendTextMessage(...text) {
    if (this.message && this.message.id) {
      this.module.sendMessage(Message.fix({ text }), {
        previousMessage: this.message.id,
      })
    } else {
      throw new Error(`'No message: ${this.message}`)
    }
  }

  get(key) {
    return this.globalContext[this.userId][key]
  }
}
