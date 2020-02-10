import { parse } from 'natural-script'

export default class CallToAction {
  constructor() {
    this.conditions = []
    this.callback = () => {
      console.error('callback not defined')
    }
    this.probability = 0.5
    this.processEvaluation = null
    this.name = ''
  }

  if(status) {
    this.status = status
    return this
  }

  withPriority(priority) {
    this.probability = priority
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
    this.attach(this)
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
