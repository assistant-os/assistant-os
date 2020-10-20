import Identifier from './identifier'

export default class Room extends Identifier {
  constructor(name, occupants = 0) {
    super(name)
    this.occupants = occupants
    this.home = null
  }

  toJson() {
    return {
      name: this.name,
      occupants: this.occupants,
    }
  }

  setOccupants(occupants) {
    const oldNumber = this.occupants

    this.occupants = occupants

    this.emit('status-changed', {
      origin: 'people-changed',
      before: oldNumber,
      after: occupants,
      diff: occupants - oldNumber,
    })
  }
}
