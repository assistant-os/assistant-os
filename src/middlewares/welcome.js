import Middleware from '../os/middleware'
let welcome = new Middleware()

let cache = {}

welcome.hear('*', (req, res, next) => {
    if (cache[req.user.id] && cache[req.user.id].state === 'waiting-for-name') {
        res.reply(`Ok so your name is "${req.text}"?`)
        cache[req.user.id].state = 'waiting-for-confirmation'
        cache[req.user.id].name = req.text
    } else {
        next()
    }
})

welcome.hear([ 'hello', 'hi', 'good morning', 'good afternoon', 'good evening' ], (req, res) => {
    res.replyRandomly([ 'Hello', 'Hi', () => {
        if (req.date.getHours() < 11) {
            return 'Good morning!'
        } else if (req.date.getHours() < 18) {
            return 'Good afternoon!'
        } else if (req.date.getHours() < 23) {
            return 'Good evening!'
        } else {
            return 'Good night!'
        }
    } ])

    if (req.user.real_name) {
        res.reply('What can I do for you?')
    } else {
        res.reply('Nice to meet you !')
        res.reply(`My name is ${welcome.config().name}.`)
        res.reply(`And you what is your name?`)
        cache[req.user.id] = { state: 'waiting-for-name' }
    }
})

welcome.hear([ 'cancel', 'forget', 'forget it' ], (req, res, next) => {
    if (cache[req.user.id]) {
        delete cache[req.user.id]
        res.reply('Ok')
    } else {
        next()
    }

})

welcome.hear([ 'yes', 'ouep' ], (req, res, next) => {
    if (cache[req.user.id] && cache[req.user.id].state === 'waiting-for-confirmation') {
        res.reply(`Roger that. Welcome ${cache[req.user.id].name}!`)
        req.user.real_name = cache[req.user.id].name
        req.user.save()
        res.reply('Can I do for you?')
        delete cache[req.user.id]
    } else {
        next()
    }
})

welcome.hear([ 'no', 'nope' ], (req, res, next) => {
    if (cache[req.user.id] && cache[req.user.id].state === 'waiting-for-confirmation') {
        res.reply(`So what is your name?`)
        cache[req.user.id].state = 'waiting-for-name'
    } else {
        next()
    }
})


export default welcome
