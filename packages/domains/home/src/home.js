import Identifier from './identifier'
import Room from './room'

export default class Home extends Identifier {
  constructor(name = '', location = '') {
    super(name)
    this.location = location
    this.occupants = 0
    this.rooms = []
  }

  add(room) {
    if (room instanceof Room) {
      this.rooms.push(room)
      room.home = this

      room.on('status-changed', data => {
        this.emit('status-changed', { ...data, room })
      })
    }

    return this
  }

  toJson() {
    return {
      name: this.name,
      occupants: this.occupants,
      location: this.location,
      rooms: this.rooms.map(r => r.toJson()),
    }
  }

  findRoomByName(name) {
    // find just the first different room
    return this.rooms.find(r => r.name === name)
  }

  // estimateTotalPeople(room, status) {
  //   if (status && this.totalPeople === 0) {
  //     this.totalPeople = 1
  //   }
  // }

  findClosestRoom(room) {
    return this.rooms.find(r => r.name !== room.name)
  }

  // updateStatus(roomName, status) {
  //   this.estimateTotalPeople(roomName, status)

  //   if (status) {
  //     const room = this.rooms.find(r => r.name === roomName)

  //     if (room.totalPeople === 0) {
  //       room.totalPeople += 1

  //       const otherRoom = this.findClosestRoom(room)

  //       if (otherRoom.totalPeople > 0) {
  //         otherRoom.totalPeople -= 1
  //       }
  //     }
  //   }
  // }

  detectPersonInRoom(room) {
    if (this.occupants === 0) {
      this.occupants = 1
    }
    if (room.occupants === 0) {
      room.setOccupants(1)
    }

    const leavingRoom = this.findClosestRoom(room)
    if (leavingRoom.occupants > 0) {
      leavingRoom.setOccupants(leavingRoom.occupants - 1)
    }
  }
}
