import EventEmitter from 'events'
import { parse } from 'natural-script'

import Context from '../utils/context'
import CallToAction from './call-to-action'

const match = (text, condition, userId, message) => {
  if (typeof condition === 'string') {
    return parse(text, condition)
  } else if (typeof condition === 'function') {
    return condition(text, userId, message)
  } else if (Array.isArray(condition)) {
    const promises = condition.map(c => match(text, c, userId, message))
    return Promise.all(promises).then(matches =>
      matches.reduce((acc, current) => acc && current, true)
    )
  }
  return Promise.resolve(true)
}

export default class Action extends EventEmitter {
  constructor(name, actions = []) {
    super()
    this.name = name
    this.globalContext = {}

    this.actions = actions
    this.onStart = () => {}
    this.onStop = () => {}
  }

  start() {
    this.onStart()
  }

  stop() {
    this.onStop()
  }

  if(status) {
    return new CallToAction(status, callToAction =>
      this.actions.push(callToAction)
    )
  }

  when(condition, probability = 1) {
    const callToAction = new CallToAction(null, callToAction =>
      this.actions.push(callToAction)
    )

    callToAction.when(condition)
    callToAction.probability = probability
    return callToAction
  }

  async findAction(message, userId) {
    if (!message.text) {
      return null
    }

    const context = this.getContext(message)

    for (const action of this.actions) {
      const results = await match(
        message.text,
        action.conditions,
        userId,
        message
      )
      if (context.hasStatus(action.status) && results) {
        return {
          action,
          results,
          context,
          text: message.text,
          message,
        }
      }
    }
    return null
  }

  async evaluateProbability(message, userId) {
    return this.findAction(message, userId).then(found => {
      const probability = found
        ? typeof found.action.probability === 'function'
          ? found.action.probability(found)
          : found.action.probability
        : 0
      return probability
    })
  }

  async respond(message, userId) {
    if (!message.text) {
      return
    }

    const found = await this.findAction(message, userId)

    if (found) {
      const { action, context, results, text } = found

      action.callback({ ...results, message, context, userId, text })
    }
  }

  getContext(message, userId = null) {
    return new Context(this, userId, message)
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
