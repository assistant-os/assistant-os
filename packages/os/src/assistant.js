// import Core from './core'
// import Nexus from './nexus'

import { logger } from '@assistant-os/utils'
import Slack from '@assistant-os/slack'
import Hello from '@assistant-os/hello'
import Oups from '@assistant-os/oups'
import Emails from '@assistant-os/emails'
import * as Message from '@assistant-os/utils/message'

export default class Assistant {
  constructor({
    name = 'Assistant',
    timeout = 15000 /* maximum accepted delay for a response by modules */,
  } = {}) {
    this.identity = { name }
    this.timeout = timeout

    this.adapters = [new Slack()]
    this.modules = [new Hello(), new Oups(), new Emails()]

    this.threads = {}

    this.lastAdaptersUsed = {}
  }

  storeMetaMessage(message, userId, adapter) {
    this.threads[message.id] = { userId, message, adapterName: adapter.name }
  }

  findLastAdapter(userId) {
    const lastAdapterUsed = this.lastAdaptersUsed[userId]

    if (lastAdapterUsed) {
      return this.adapters.find(a => a.name === lastAdapterUsed)
    }

    return this.adapters[0]
  }

  findMetaMessage(message) {
    if (message.previousMessage) {
      const { userId, adapterName } = this.threads[message.previousMessage]
      const adapter = this.adapters.find(a => a.name === adapterName)
      return { userId, adapter }
    }

    if (message.userId) {
      const adapter = this.findLastAdapter(message.userId)
      return { userId: message.userId, adapter }
    }

    return {}
  }

  async chooseModule(message, userId) {
    const modules = [...this.modules] // we use copy just in case modules change during the request
    const probabilities = await Promise.all(
      modules.map(m => m.evaluateProbability(message, userId))
    )

    const bestModuleIndex = probabilities.reduce(
      (bestProbabilityIndex, probability, index) => {
        if (probability > probabilities[bestProbabilityIndex]) {
          return index
        }
        return bestProbabilityIndex
      },
      0
    )
    return this.modules[bestModuleIndex]
  }

  installAdapter(adapter) {
    adapter.on('message', async ({ userId, ...message }) => {
      this.storeMetaMessage(message, userId, adapter)
      this.threads[message.id] = { userId, message, adapterName: adapter.name }
      const module = await this.chooseModule(message, userId)
      module.respond(message, userId)
    })
  }

  installModule(module) {
    module.on('message', message => {
      const { adapter, userId } = this.findMetaMessage(message)
      if (adapter && userId) {
        this.lastAdaptersUsed[userId] = adapter.name
        adapter.sendMessage(userId, message)
      } else {
        logger.error('Impossible to send the message', { adapter, userId })
      }
    })
  }

  async start() {
    this.adapters.forEach(a => this.installAdapter(a))
    this.modules.forEach(m => this.installModule(m))

    await Promise.all(this.adapters.map(adapter => adapter.start()))
    await Promise.all(this.modules.map(module => module.start()))
    logger.info(`started ${this.identity.name}`)

    this.adapters[0].sendMessage('friedrit', Message.fix({ text: 'Ready' }))
  }

  stop() {
    logger.info(`stopped ${this.identity.name}`)
  }
}
