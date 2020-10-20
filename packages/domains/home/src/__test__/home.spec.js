import Room from '../room'
import Home from '../home'

describe('Home', () => {
  const name = 'Home 1'

  it('should have an id', () => {
    const home = new Home(name)

    expect(typeof home.id).toEqual('string')
  })

  it('should have the specified name and total people of 0', () => {
    const home = new Home(name)

    expect(home.name).toEqual(name)
    expect(home.occupants).toEqual(0)
  })

  it('should have 0 rooms by default', () => {
    const home = new Home(name)

    expect(home.rooms).toHaveLength(0)
  })

  it('should add 1 room', () => {
    const home = new Home(name)
    const room = new Room('room 1')

    home.add(room)
    expect(home.rooms).toHaveLength(1)
    expect(room.home).toEqual(home)
  })

  it('should return name and occupants as a js object', () => {
    const home = new Home(name)
    const room = new Room('room 1')
    home.occupants = 1
    home.add(room)

    expect(home.toJson()).toEqual({
      name,
      occupants: 1,
      rooms: [room.toJson()],
    })
  })

  it('should find the good room', () => {
    const home = new Home(name)
    const room1 = new Room('room 1')
    const room2 = new Room('room 2')

    home.add(room1)
    home.add(room2)

    expect(home.findRoomByName('room 2')).toEqual(room2)
  })

  it('should move an occupant from one room to another', () => {
    const home = new Home(name)
    const room1 = new Room('room 1')
    const room2 = new Room('room 2')
    home.add(room1)
    home.add(room2)
    home.occupants = 1
    room1.occupants = 1

    home.detectPersonInRoom(room2)

    expect(room1.occupants).toEqual(0)
    expect(room2.occupants).toEqual(1)
  })

  it('should reinitialize occupant in home', () => {
    const home = new Home(name)
    const room1 = new Room('room 1')
    const room2 = new Room('room 2')
    home.add(room1)
    home.add(room2)

    home.detectPersonInRoom(room1)

    expect(home.occupants).toEqual(1)
  })
})
