import Middleware from './middleware'

class Os extends Middleware {

    constructor ({ parser, adapters, name }) {
        super(parser)
        this.adapters = adapters
        this.name = name

        for (let i in this.adapters) {
            let adapter = this.adapters[i]
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
    }
}



export default Os
