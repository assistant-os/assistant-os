// import Core from './core'
// import Nexus from './nexus'

import { logger, Users } from '@assistant-os/utils'
import Slack from '@assistant-os/slack'
import Http from '@assistant-os/http'
import Hello from '@assistant-os/hello'
import Oups from '@assistant-os/oups'
import Emails from '@assistant-os/emails'
import Contracts from '@assistant-os/contracts'
import Movies from '@assistant-os/movies'

export default class Assistant {
  constructor({
    name = 'Assistant',
    timeout = 15000 /* maximum accepted delay for a response by actions */,
  } = {}) {
    this.identity = { name }
    this.timeout = timeout

    this.adapters = [new Slack(), new Http()]
    this.actions = [
      new Hello(),
      new Oups(),
      new Emails(),
      new Contracts(),
      new Movies(),
    ]

    this.threads = {}

    this.lastAdaptersUsed = {} // TODO save if in data base
    this.users = new Users()
  }

  storeMetaMessage(message, userId, adapter) {
    this.threads[message.id] = { userId, message, adapterName: adapter.name }
  }

  findLastAdapterUsed(userId) {
    let lastAdapterUsed = this.lastAdaptersUsed[userId]

    if (!lastAdapterUsed) {
      const user = this.users.findById(userId)
      if (user && Object.keys(user.adapters).length > 0) {
        lastAdapterUsed = Object.keys(user.adapters)[0]
      }
    }

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
      const adapter = this.findLastAdapterUsed(message.userId)
      return { userId: message.userId, adapter }
    }

    return {}
  }

  async chooseModule(message, userId) {
    const actions = [...this.actions] // we use copy just in case actions change during the request
    const probabilities = await Promise.all(
      actions.map(m => m.evaluateProbability(message))
    )

    const adapter = this.findLastAdapterUsed(userId)
    adapter.sendAction(userId, { type: 'typing' })

    const bestModuleIndex = probabilities.reduce(
      (bestProbabilityIndex, probability, index) => {
        if (probability > probabilities[bestProbabilityIndex]) {
          return index
        }
        return bestProbabilityIndex
      },
      0
    )
    return this.actions[bestModuleIndex]
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
    this.actions.forEach(m => this.installModule(m))

    await Promise.all(this.adapters.map(adapter => adapter.start()))
    await Promise.all(this.actions.map(module => module.start()))
    logger.info(`started ${this.identity.name}`)

    // this.adapters[0].sendMessage('friedrit', Message.fix({ text: 'Ready' }))
  }

  stop() {
    logger.info(`stopped ${this.identity.name}`)
  }
}
