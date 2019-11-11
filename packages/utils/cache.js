export default class Cache {
  constructor() {
    this.cache = {}
  }

  add(message, data) {
    this.cache[message.id] = data
  }

  remove(message) {
    this.cache[message.id] = null
    delete this.cache[message.id]
  }

  get(message) {
    return this.cache[message.id]
  }
}
