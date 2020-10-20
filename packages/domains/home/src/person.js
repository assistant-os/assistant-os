import Identifier from './identifier'

export default class Person extends Identifier {
  constructor(name) {
    super(name)
    this.activity = null

    this.room = null
  }

  move(room) {
    const previousRoom = this.room

    this.room = room

    if (previousRoom) {
      previousRoom.people = previousRoom.people.filter(p => p.id !== this.id)
    }

    room.people = [...room.people, this]
  }
}
