import ns from 'natural-script'

import Middleware from '../os/middleware'
import profile from '../config/profile'

import messageProcessor from '../helpers/message-processor'

/**
* The root middleware
*/
export default class Os extends Middleware {

  constructor (opts) {
    super({
      id: 'os',
      description: 'main middleware',
      parser: opts.parser
    })

    if (!opts.parser) {
      this.parser = ns.parse
    }

    if (!opts.adapters || !(opts.adapters instanceof Array)) {
      throw 'adapters missing'
    }

    this.adapters = opts.adapters

    this.id = 'os'
    this.name = opts.name || profile.name
    this.color = opts.color || profile.color
    this.icon_url = opts.icon_url || profile.icon_url
    this.response_time = opts.response_time || 1000
    this.buffer = {}
    this.nexus = null
  }

  speak (user, message, options = {}) {

    const { adapter = this.adapters[0], random = false, req = null } = options

    if (random) {
      message = messageProcessor.random(message)
    }

    // console.log('speak', user, message)

    let userId = ''
    if (typeof user === 'string') {
      userId = user
    } else {
      userId = user.id
    }

    if (!this.buffer.hasOwnProperty(userId)) {
      this.buffer[userId] = []
    }

    this.buffer[userId].push({
      adapter,
      user,
      text: messageProcessor.processResponse(message),
      req,
    })

    // if the message we just put is the last one
    if (this.buffer[userId].length === 1) {
      this.processBuffer(userId)
    }
  }

  config () {
    return {
      name: this.name,
      color: this.color,
      icon_url: this.icon_url
    }
  }

  processBuffer (userId) {
    if (this.buffer[userId].length > 0) {
      const message = this.buffer[userId][0]

      message.adapter.send(message.user, message.text)

      let timeout = 0
      if (typeof this.response_time === 'function') {
        timeout = this.response_time(message.text)
      } else {
        timeout = this.response_time
      }
      setTimeout(() => {
        this.buffer[userId].shift()
        this.processBuffer(userId)
      }, timeout)
    }
  }

  start () {
    if (this.adapters.length === 0) {
      this.error('error', 'no-adapter')
      return
    }

    for (const adapter of this.adapters) {
      adapter.start(this.config())
      adapter.on('message', (req) => {

        req.os = this

        this.run(req, {
          reply: (message, options = {}) => {
            this.speak(req.user, message, { ...options, req, adapter,  })
          }
        })
      })
    }

    if (this.nexus) {
      this.nexus.start()
    }

    this.emit('ready')
  }

}
