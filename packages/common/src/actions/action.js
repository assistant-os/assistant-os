import EventEmitter from 'events'

import SubAction from './subaction'
import { improveTextMessage } from './messages'

export default class Action extends EventEmitter {
  constructor(name, actions = []) {
    super()
    this.name = name

    this.subActions = actions

    this.globalContext = {}
    this.cache = {}
    this.onStart = () => {}
    this.onStop = () => {}
  }

  start() {
    this.onStart()
  }

  stop() {
    this.onStop()
  }

  if(...args) {
    const subAction = new SubAction()
    subAction.if(...args)
    this.subActions.push(subAction)
    return subAction
  }

  when(...args) {
    const subAction = new SubAction()
    subAction.when(...args)
    this.subActions.push(subAction)
    return subAction
  }

  then(...args) {
    const subAction = new SubAction()
    subAction.then(...args)
    this.subActions.push(subAction)
    return subAction
  }

  async findAction(message) {
    const hasStatus = status =>
      status === null ||
      (message.userId in this.globalContext &&
        this.globalContext[message.userId].status === status)

    const availableActions = this.subActions.filter(a => hasStatus(a.status))

    for (const action of availableActions) {
      const isMatching = await action.match(message)
      if (isMatching) {
        this.cache[message.id] = { action, query: isMatching }
        return true
      }
    }
    return null
  }

  evaluateProbability(message) {
    return this.findAction(message).then(found =>
      found ? this.cache[message.id].action.probability : 0
    )
  }

  async apply(message) {
    const action =
      message.id in this.cache
        ? this.cache[message.id].action
        : await this.findAction(message)

    if (!action) {
      return
    }

    const answer = (text, options) => {
      this.sendMessage({
        text: improveTextMessage(text, options),
        userId: message.userId,
        previousMessageId: message.id,
      })
    }

    const setStatus = (status, context) => {
      this.globalContext[message.userId] = { status, ...context }
    }

    const context = this.globalContext[message.userId]

    const query = message.id in this.cache ? this.cache[message.id].query : {}
    action.callback({ message, answer, setStatus, context, query })
  }

  sendMessage(message) {
    this.emit('message', message)
  }

  forgetStatus(userId) {
    if (userId in this.globalContext) {
      this.globalContext[userId].status = null
    }
  }
}
