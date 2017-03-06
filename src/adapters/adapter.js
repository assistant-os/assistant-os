import EventEmitter from 'events'

class Adapter extends EventEmitter {

    constructor () {
        super()
        this.bot = null
    }

    start (config) {
        this.name = config.name
        this.color = config.color
        this.icon_url = config.icon_url
    }

    send (user, text, config) {

    }
}



export default Adapter
