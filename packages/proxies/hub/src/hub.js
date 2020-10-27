import EventEmitter from 'events'

class Hub extends EventEmitter {
  constructor() {
    super()

    this.adapters = []
    this.home = null
  }

  async start() {
    this.adapters.forEach(adapter => {
      adapter.on('detect-person-in-room', ({ room, isPresent }) => {
        this.home.detectPersonInRoom(room, isPresent)
      })
    })

    return this.home
  }

  async execute(query) {
    this.adapters.forEach(adapter => {
      adapter.execute(query)
    })
  }
}

const hub = new Hub()

export default hub
