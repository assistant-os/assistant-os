export default class CallToAction {
  constructor(status = null, attach = () => {}, type = 'text') {
    this.conditions = []
    this.type = type
    this.status = status
    this.callback = () => {
      console.error('callback not defined')
    }
    this.attach = attach
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
}
