import EventEmitter from 'events'

const random = () =>
  Math.random()
    .toString(36)
    .substring(7)

export default class Identifier extends EventEmitter {
  constructor(name) {
    super()
    this.id = random()
    this.name = name
  }

  toJson() {
    return { id: this.id, name: this.name }
  }

  static fromJson(json) {
    this.id = json.id
    this.name = json.name
  }
}
