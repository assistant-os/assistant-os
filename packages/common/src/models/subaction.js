import { parse } from 'natural-script'

export default class SubAction {
  constructor() {
    this.conditions = []
    this.status = null
    this.callback = () => {
      console.error('callback not defined')
    }
    this.probability = 0.5
    this.processEvaluation = null
    this.name = ''
  }

  while(status) {
    this.status = status
    return this
  }

  withPriority(priority) {
    this.probability = priority
    return this
  }

  when(condition) {
    this.conditions.push(condition)
    return this
  }

  and(condition) {
    this.conditions.push(condition)
    return this
  }

  then(callback) {
    this.callback = callback
    return this
  }

  match(message) {
    if (typeof this.condition === 'string') {
      return parse(message.text, this.condition)
    } else if (typeof this.condition === 'function') {
      return this.condition(message.text, message)
    } else if (Array.isArray(this.condition)) {
      const promises = this.condition.map(c => this.match(message))
      return Promise.all(promises).then(matches =>
        matches.reduce((acc, current) => acc && current, true)
      )
    }
    return Promise.resolve(true)
  }
}
