import EventEmitter from 'events'

/**
 * Class to send messages to user and receive messages from user
 *
 * Use the method send to send messages to user
 * Catch event message to receive messages from user
 *
 * This class automatically create user if it doesn't already exist in database
 *
 */
export default class Adapter extends EventEmitter {

    constructor () {
        super()
        this.bot = null
    }

    /**
     * start initialization if connected with third party cloud service
     * @param  {[type]} config [description]
     */
    start ({ name = '', color = '#000', icon_url = '' }) {
        this.name = name
        this.color = color
        this.icon_url = icon_url
    }

    send (user, text, config) {

    }

    findUser (opts) {
        return new Promise((resolve, reject) => {
            reject()
        })
    }
}
