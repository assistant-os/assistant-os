// import Core from './core'
// import Nexus from './nexus'

import { logger } from '@assistant-os/utils'
import Slack from '@assistant-os/slack'
import Hello from '@assistant-os/hello'

export default class Assistant {
  constructor({
    name = 'Assistant',
    timeout = 15000 /* maximum accepted delay for a response by modules */,
  } = {}) {
    this.identity = { name }
    this.timeout = timeout

    this.adapters = [new Slack()]
    this.modules = [new Hello()]

    this.threads = {}
  }

  storeMetaMessage(message, userId, adapter) {
    this.threads[message.id] = { userId, message, adapterName: adapter.name }
  }

  findMetaMessage({ previousMessage }) {
    const { userId, adapterName } = this.threads[previousMessage]
    const adapter = this.adapters.find(a => a.name === adapterName)

    return { userId, adapter }
  }

  async chooseModule(message) {
    const modules = [...this.modules] // we use copy just in case modules change during the request
    const probabilities = await Promise.all(
      modules.map(m => m.evaluateProbability(message))
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
      const module = await this.chooseModule(message)
      module.respond(message)
    })
  }

  installModule(module) {
    module.on('message', message => {
      const { adapter, userId } = this.findMetaMessage(message)
      if (adapter && userId) {
        adapter.sendMessage(userId, message)
      }
    })
  }

  async start() {
    await Promise.all(this.adapters.map(adapter => adapter.start()))
    await Promise.all(this.modules.map(module => module.start()))
    logger.info(`started ${this.identity.name}`)

    this.adapters.forEach(this.installAdapter)

    this.modules.forEach(this.installModule)

    this.adapters[0].sendMessage('friedrit', { text: 'Ready' })
  }

  stop() {
    logger.info(`stopped ${this.identity.name}`)
  }
}
