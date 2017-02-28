import ns from 'natural-script'

import { version } from '../../package.json'
import Middleware from '../os/middleware'

let debug = new Middleware(ns.parse)

debug.hear('version', (req, res) => {
    res.reply(version)
})

debug.hear('name', (req, res) => {
    res.reply(req.os.name)
})

export default debug
