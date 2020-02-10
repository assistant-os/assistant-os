import { parse } from 'natural-script'

export default class SubAction {
  constructor() {
    this.conditions = []
    this.status = null
    this.callback = () => {}
    this.probability = 0.5
    this.name = ''
  }

  if(condition) {
    this.conditions.push(condition)
    return this
  }

  withPriority(priority) {
    this.probability = priority
    return this
  }

  when(status) {
    this.status = status
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

  matchOne(message, condition) {
    if (message.text && typeof condition === 'string') {
      return parse(message.text, condition)
    }
    return Promise.resolve(false)
  }

  match(message) {
    const promises = this.conditions.map(c => this.matchOne(message, c))
    return Promise.all(promises).then(matches =>
      matches.reduce((acc, current) => acc && current, true)
    )
  }
}
