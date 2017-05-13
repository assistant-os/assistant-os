import Middleware from '../os/middleware'

import state from '../os/state'

let welcome = new Middleware()

welcome.hear('*', (req, res, next) => {
    if (state.get(req.user) && state.get(req.user, 'status') === 'waiting-for-name') {
        res.reply(`Ok so your name is "${req.text}"?`)
        state.set(req.user, 'status', 'waiting-for-confirmation')
        state.set(req.user, 'name', req.text)
        // cache[req.user.id].state = 'waiting-for-confirmation'
        // cache[req.user.id].name = req.text
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
        state.set(req.user, 'status', 'waiting-for-name')
        // cache[req.user.id] = { state: 'waiting-for-name' }
    }
})

welcome.hear([ 'cancel', 'forget', 'forget it' ], (req, res, next) => {
    if (state.get(req.user) && state.get(req.user, 'status')) {
      state.remove(req.user, 'status')
      res.reply('Ok')
    } else {
        next()
    }

})

welcome.hear([ 'yes', 'ouep' ], (req, res, next) => {
    if (state.get(req.user) && state.get(req.user, 'status') === 'waiting-for-confirmation') {
        res.reply(`Roger that. Welcome ${state.get(req.user, 'name')}!`)
        req.user.real_name = state.get(req.user, 'name')
        req.user.save()
        res.reply('Can I do for you?')
        state.remove(req.user, 'status')
    } else {
        next()
    }
})

welcome.hear([ 'no', 'nope' ], (req, res, next) => {
    if (state.get(req.user) && state.get(req.user, 'status') === 'waiting-for-confirmation') {
        res.reply(`So what is your name?`)
        state.set(req.user, 'status', 'waiting-for-name')
    } else {
        next()
    }
})

welcome.hear([ 'thanks', 'thx', 'thank you' ], (req, res, next) => {
  res.reply(`You are welcome ${req.user.real_name}!`)
})



export default welcome
