import ns from 'natural-script'

import Middleware from './middleware'
import profile from '../config/profile'

class Os extends Middleware {

    constructor (opts) {
        super(opts.parser)

        if (!opts.parser) {
            this.parser = ns.parse
        }

        if (!opts.adapters) {
            throw 'adapters missing'
        }

        this.adapters = opts.adapters

        this.name = opts.name || profile.name
        this.color = opts.color || profile.color
        this.icon_url = opts.icon_url || profile.icon_url




    }

    start () {

        let config = {
            name: this.name,
            color: this.color,
            icon_url: this.icon_url
        }

        for (let adapter of this.adapters) {
            adapter.start(config)
            adapter.on('message', (req) => {

                let reply = (message) => {
                    var text = ''
                    if (typeof message === 'string') {
                        text = message
                    } else if (typeof message === 'function') {
                        text = message()
                    }
                    adapter.send(req.user, text)
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

        this.emit('ready')
    }

    speak (user, text, adapter = null) {

        if (!adapter && this.adapters) {
            this.adapters[0].send(user, text)
        }
    }
}



export default Os
