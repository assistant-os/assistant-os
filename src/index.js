import winston from 'winston'
import ns from 'natural-script'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import Os from './os/os'
import Slack from './adapters/slack'

import welcome  from './middlewares/welcome'
import debug  from './middlewares/debug'
import scheduler from './middlewares/scheduler'
import { STATE as EventState, TYPE as EventType } from './models/event'

try {
    fs.accessSync(path.join(__dirname, '../.env'), fs.R_OK)
    // use .env file config
    dotenv.config()
} catch (e) {
    console.log(e)
}

let name = process.env.NAME || 'jarvis'

let slack = new Slack(
    process.env.SLACK_API_TOKEN,
    name,
    process.env.COLOR || '#3f51b5',
    process.env.ICON_URL || 'https://avatars1.githubusercontent.com/u/24452749?v=3&s=200'
)
slack.start()
slack.on('ready', () => {
    winston.info('slack ready')
})

let os = new Os({
    parser: ns.parse,
    adapters: [ slack ],
    name: name
})

os.use(welcome)
os.use(debug)
os.use(scheduler)

os.hear('wake me up {{date:date}}', (req, res) => {
    // console.log(req.parsed.date)
    // res.reply('ok')
    scheduler.schedule(req.user, EventType.ONE_SHOT, 'wake-up', req.parsed.date.start.date().toString())
})

scheduler.on('event.scheduled', ({ diff, event }) => {
    winston.info('event.scheduled')
    slack.send(event.user, 'ok event scheduled')
})

scheduler.on('event.ready', (event) => {
    winston.info('event.ready')
    slack.send(event.user, 'let\'s go')
    event.finish()
})

os.hear('*', (req, res) => {
    res.reply('Sorry, I didn\'t understand your request')
})
