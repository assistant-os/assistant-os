import EventEmitter from 'events'
import { parse } from 'natural-script'

import SubAction from './subaction'

export default class Action extends EventEmitter {
  constructor(name, actions = []) {
    super()
    this.name = name

    this.subActions = actions

    this.globalContext = {}
    this.foundActionsCache = {}
    this.onStart = () => {}
    this.onStop = () => {}
  }

  start() {
    this.onStart()
  }

  stop() {
    this.onStop()
  }

  when(condition) {
    const subAction = new SubAction()
    subAction.when(condition)
    this.subActions.push(subAction)
    return subAction
  }

  async findAction(message) {
    if (!message.text) {
      return null
    }

    const hasStatus = status =>
      status === null ||
      (message.userId in this.globalContext &&
        this.globalContext[message.userId].status === status)

    const availableActions = this.subActions.filter(a => hasStatus(a.status))

    for (const action of availableActions) {
      const isMatching = await action.match(message)
      if (isMatching) {
        this.foundActionsCache[message.id] = { action, isMatching }
        return { isMatching, action }
      }
    }
    return null
  }

  async evaluateProbability(message) {
    return this.findAction(message).then(action => action.proability)
  }

  async apply(message) {
    const action =
      message.id in this.foundActionsCache
        ? this.foundActionsCache[message.id].action
        : await this.findAction(message)

    const answer = text => {
      this.sendMessage({
        text,
        userId: message.userId,
        previousMessage: message.id,
      })
    }

    const setStatus = status => {
      this.globalContext[message.userId] = { status }
    }

    if (action) {
      action.callback({ message, answer, setStatus })
    }
  }

  sendMessage(message, meta = {}) {
    this.emit('message', {
      ...message,
      ...meta,
    })
  }

  forgetStatus(userId) {
    if (userId in this.globalContext) {
      this.globalContext[userId].status = null
    }
  }
}
