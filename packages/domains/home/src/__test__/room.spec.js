import Room from '../room'

describe('Room', () => {
  const name = 'Living room'

  it('should have an id', () => {
    const room = new Room(name)

    expect(typeof room.id).toEqual('string')
  })

  it('should have the specified name and total people of 0', () => {
    const room = new Room(name)

    expect(room.name).toEqual(name)
    expect(room.occupants).toEqual(0)
  })

  it('should have the specified name and total people', () => {
    const room = new Room(name, 10)

    expect(room.name).toEqual(name)
    expect(room.occupants).toEqual(10)
  })

  it('should return name and peopleCount as a js object', () => {
    const room = new Room(name, 10)

    expect(room.toJson()).toEqual({ name, occupants: 10 })
  })

  it('should belong to no home by default', () => {
    const room = new Room(name, 10)

    expect(room.home).toEqual(null)
  })

  it('should change occupants', () => {
    const room = new Room(name)

    room.setOccupants(10)

    expect(room.occupants).toEqual(10)
  })

  it('should emit event status-changed', () => {
    const event = jest.fn()
    const room = new Room(name)
    room.on('status-changed', event)

    room.setOccupants(10)

    expect(event).toHaveBeenCalledWith({
      origin: 'people-changed',
      before: 0,
      after: 10,
      diff: 10,
    })
  })
})
