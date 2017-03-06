import ns from 'natural-script'
import winston from 'winston'

import { version } from '../../package.json'
import Middleware from '../os/middleware'

import Event from '../models/event'
import User from '../models/user'
import DateEvent from '../models/date-event'

let debug = new Middleware(ns.parse)

debug.hear('version', (req, res) => {
    res.reply(version)
})

debug.hear('name', (req, res) => {
    res.reply(req.os.name)
})

debug.hear('reinitialize', (req, res) => {
    User.sync({ force: true })
    .then(() => {
        return Event.sync({ force: true })
    })
    .then(() => {
        return DateEvent.sync({ force: true })
    })
    .then(() => {
        winston.info('retiniatialization done')
    })
    .catch((e) => {
        winston.error('retiniatialization error', { error:e })
    })
})

export default debug
