export default class CallToAction {
  constructor(status, attach = () => {}, type = 'text') {
    this.conditions = []
    this.type = type
    this.status = status
    this.callback = () => {
      console.error('callback not defined')
    }
    this.attach = attach
    this.probability = 0.5
  }

  if(status) {
    this.status = status
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
    this.attach(this)
    return this
  }
}
