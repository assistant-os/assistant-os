import { Action, Users } from '@assistant-os/common'

import * as Memories from './memories'

export default class Memory extends Action {
  constructor() {
    super('hello')

    this.users = new Users()
  }

  start() {
    Memories.initializeTable()
  }
  stop() {}

  evaluateProbability(message, userId) {
    return new Promise(resolve => {
      if (message.text && message.text.startsWith('timelog start')) {
        resolve(1)
        return
      }

      if (message.text && message.text.startsWith('rm')) {
        resolve(1)
        return
      }

      if (message.text && Memories.has(message.text, userId)) {
        resolve(1)
        return
      }

      resolve(0)
    })
  }

  async respond(message, userId) {
    const context = this.getContext(message)
    if (message.text && message.text.startsWith('save')) {
      let text = message.text.replace('save', '').trim()
      const [key] = text.split(' ')
      const value = text.replace(key, '').trim()
      Memories.add(key, value, userId)
      context.sendTextMessage(`Ok I saved "${key}".`)
      return
    }

    if (message.text && message.text.startsWith('rm')) {
      let key = message.text.replace('rm', '').trim()
      Memories.remove(key, userId)
      context.sendTextMessage(`Ok I removed "${key}".`)
      return
    }

    if (message.text && Memories.has(message.text, userId)) {
      context.sendTextMessage(Memories.get(message.text, userId).value, {
        straight: true,
      })
    }
  }
}
