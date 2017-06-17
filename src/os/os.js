import ns from 'natural-script'

import Middleware from '../os/middleware'
import profile from '../config/profile'

class Os extends Middleware {

    constructor (opts) {
        super({
            parser: opts.parser
        })

        if (!opts.parser) {
            this.parser = ns.parse
        }

        if (!opts.adapters || !(opts.adapters instanceof Array)) {
            throw 'adapters missing'
        }

        this.adapters = opts.adapters


        this.name = opts.name || profile.name
        this.color = opts.color || profile.color
        this.icon_url = opts.icon_url || profile.icon_url
        this.response_time = opts.response_time || 1000
        this.buffer = []
        this.nexus = null
    }

    speak (user, text) {
        let defaultAdapter = this.adapters[0]
        if (defaultAdapter) {
            if (typeof user === 'string') {
                defaultAdapter.findUser({
                    name: user
                }).then((user) => {
                    defaultAdapter.send(user, text)
                })
            } else {
                defaultAdapter.send(user, text)
            }
        }
    }

    config () {
        return {
            name: this.name,
            color: this.color,
            icon_url: this.icon_url
        }
    }

    getNexus () {
      return this.nexus
    }

    processBuffer () {
        if (this.buffer.length > 0) {
            let reply = this.buffer[0]
            // console.log(reply.text)
            reply.adapter.send(reply.req.user, reply.text)

            let timeout = 0
            if (typeof this.response_time === 'function') {
                timeout = this.response_time(reply.text)
            } else {
                timeout = this.response_time
            }
            setTimeout(() => {
                this.buffer.shift()
                this.processBuffer()
            }, timeout)
        }
    }

    start () {

        for (let adapter of this.adapters) {
            adapter.start(this.config())
            adapter.on('message', (req) => {

                let reply = (message) => {
                    var text = ''
                    if (typeof message === 'string') {
                        text = message
                    } else if (typeof message === 'function') {
                        text = message()
                    } else if (message instanceof Array) {
                        text = message.join('\n')
                    }

                    // adapter.send(req.user, text)

                    this.buffer.push({
                        adapter: adapter,
                        req: req,
                        text: text
                    })
                    // console.log(text)

                    if (this.buffer.length === 1) {
                        this.processBuffer()
                    }
                }

                req.os = this

                this.run(req, {
                    reply: reply,
                    replyRandomly: function (choices) {
                        if (choices instanceof Array && choices.length > 0) {
                            let random = Math.floor(Math.random() * 10 % choices.length)
                            reply(choices[random])
                        }
                    },
                    adapter: adapter
                })
            })
        }

        if (this.nexus) {
          this.nexus.start()
        }

        this.emit('ready')
    }


}



export default Os
