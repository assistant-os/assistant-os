import { logger, Users, Action } from '@assistant-os/common'
import * as threads from './threads'

export default class Assistant {
  constructor({ name = 'Unknown', timeout = 15000 } = {}) {
    this.identity = { name }
    this.timeout = timeout

    this.adapters = []
    this.actions = []

    this.threads = {}

    this.lastAdaptersUsed = {} // TODO save if in data base
    this.users = new Users()
  }

  addAction(action) {
    let instance = null
    if (typeof action === 'function') {
      instance = new action()
    } else if (action instanceof Action) {
      instance = action
    }

    this.actions.push(instance)
  }

  storeMessage(message, userId, adapter) {
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

  findActionWithBestProbability(probabilities) {
    const bestModuleIndex = probabilities.reduce(
      (bestProbabilityIndex, probability, index) =>
        probability > probabilities[bestProbabilityIndex]
          ? index
          : bestProbabilityIndex,
      0
    )
    return this.actions[bestModuleIndex].name
  }

  chooseAction(message) {
    const promises = this.actions.map(a => a.evaluateProbability(message))

    return Promise.all(promises).then(probabilities => {
      const action = this.findActionWithBestProbability(probabilities)
      return action
    })
  }

  forgetStatusForOtherActions(chosenAction, userId) {
    this.actions
      .filter(a => a.name !== chosenAction.name)
      .forEach(a => a.forgetStatus(userId))
  }

  onMessageReceivedFromAdapter(adapter) {
    return message => {
      threads.add(message, adapter)

      adapter.sendAction(message.userId, { type: 'typing' })

      this.chooseAction(message).then(actionName => {
        const action = this.actions.find(a => a.name === actionName)
        // this.forgetStatusForOtherActions(actionName, message.userId)

        action.apply(message)
      })
    }
  }

  onMessageReceivedFromAction(message) {
    const adapter = threads.findBestAdapter(message)

    if (adapter) {
      adapter.sendMessage(message)
    } else {
      logger.error('Impossible to send the message', { adapter, message })
    }
  }

  installAction(action) {
    action.on('message', this.onMessageReceivedFromAction)
  }

  installAdapter(adapter) {
    adapter.on('message', this.onMessageReceivedFromAdapter(adapter))
  }

  async start() {
    this.adapters.forEach(a => this.installAdapter(a))
    this.actions.forEach(m => this.installAction(m))

    await Promise.all(this.adapters.map(adapter => adapter.start()))
    await Promise.all(this.actions.map(module => module.start()))
    logger.info(`started ${this.identity.name}`)
  }

  stop() {
    logger.info(`stopped ${this.identity.name}`)
  }
}
