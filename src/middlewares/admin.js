import winston from 'winston'

import { version } from '../../package.json'
import Middleware from '../os/middleware'

import db from '../config/db'


let admin = new Middleware()

let cache = {}

admin.hear('version', (req, res) => {
    res.reply(version)
})

admin.hear('name', (req, res) => {
    res.reply(req.os.name)
})

admin.hear('*', (req, res, next) => {

    if (req.text.toLowerCase() === 'reinitialize') {
        cache[req.user.id] = {
            state: 'waiting-for-confirmation'
        }
        res.reply('Are you sure (yes/no)?')
    } else if (req.text.toLowerCase() === 'yes' && cache[req.user.id] && cache[req.user.id].state === 'waiting-for-confirmation') {
        res.reply('Reiniatialization pending')
        db.sync({ force: true })
        .then(() => {
            winston.info('reiniatialization done')
        })
        .catch((e) => {
            winston.error('reiniatialization error', { error:e })
        })
        delete cache[req.user.id]
    } else if (req.text.toLowerCase() === 'no' && cache[req.user.id] && cache[req.user.id].state === 'waiting-for-confirmation') {
        res.reply('Reiniatialization cancelled')
        delete cache[req.user.id]
    } else {
        next()
    }

})

export default admin
