import EventEmitter from 'events'
import hub from '@assistant-os/proxy-hub'

class Presence extends EventEmitter {
  translateInEvent(status) {
    const { origin, before, after, room } = status

    if (origin === 'people-changed') {
      if (before === 0 && after >= 1) {
        return {
          when: `a first person enters in the ${room.name}`,
        }
      } else if (before >= 1 && after === 0) {
        return {
          when: `the last person leaves the ${room.name}`,
        }
      }
    }

    return ''
  }

  async start() {
    this.home = hub.home

    this.home.on('status-changed', status => {
      const event = this.translateInEvent(status)
      event && this.emit('event', event)
    })
  }

  async status() {
    return this.home.toJson()
  }
}

const presence = new Presence()

export default presence
