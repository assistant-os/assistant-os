import { JaroWinklerDistance } from 'natural'
import { Module } from '@assistant-os/utils'

import config from './config'

export default class Hello extends Module {
  constructor() {
    super('hello')
  }

  start() {}
  stop() {}

  evaluateProbability(message) {
    return new Promise(resolve => {
      if ('text' in message) {
        const distance = JaroWinklerDistance(message.text, 'hello')
        if (distance > config.minimal_distance) {
          resolve(1)
          return
        }
      }

      resolve(0)
    })
  }

  respond(message) {
    this.emit('message', { text: 'Hello!', previousMessage: message.id })
  }
}
