import ns from 'natural-script'
import winston from 'winston'

import { version } from '../../package.json'
import Middleware from '../os/middleware'

import Event from '../models/event'
import User from '../models/user'
import DateEvent from '../models/date-event'
import SafeEmail from '../models/safe-email'
import Hack from '../models/hack'

let admin = new Middleware(ns.parse)

admin.hear('version', (req, res) => {
    res.reply(version)
})

admin.hear('name', (req, res) => {
    res.reply(req.os.name)
})

admin.hear('reinitialize', (req, res) => {
    User.sync({ force: true })
    .then(() => {
        return Event.sync({ force: true })
    })
    .then(() => {
        return DateEvent.sync({ force: true })
    })
    .then(() => {
        return SafeEmail.sync({ force: true })
    })
    .then(() => {
        return Hack.sync({ force: true })
    })
    .then(() => {
        winston.info('reiniatialization done')
    })
    .catch((e) => {
        winston.error('reiniatialization error', { error:e })
    })
})

export default admin
