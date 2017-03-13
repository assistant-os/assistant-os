import ns from 'natural-script'

import Middleware from '../os/middleware'
let welcome = new Middleware(ns.parse)

welcome.hear([ 'hello', 'hi', 'good morning', 'good afternoon', 'good evening' ], (req, res) => {
    res.replyRandomly([ 'hello', 'hi', () => {
        if (req.date.getHours() < 11) {
            return 'good morning'
        } else if (req.date.getHours() < 18) {
            return 'good afternoon'
        } else if (req.date.getHours() < 23) {
            return 'good evening'
        } else {
            return 'good night'
        }
    } ])

    if (!req.user.real_name) {
        res.reply('It seems we have not been presented!')
        res.reply(`My name is ${welcome.config().name}`)
        res.reply(`My name is ${welcome.config().name}`)

    }


})

export default welcome
