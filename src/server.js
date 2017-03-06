import winston from 'winston'
import ns from 'natural-script'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import Os from './os/os'

import { Slack } from './adapters'
import { debug, scheduler, welcome } from './middlewares'

try {
    fs.accessSync(path.join(__dirname, '../.env'), fs.R_OK)
    // use .env file config
    dotenv.config()
} catch (e) {
    console.log(e)
}

let slack = new Slack({
    token: process.env.SLACK_API_TOKEN
})

slack.on('ready', () => {
    winston.info('slack ready')
})

let os = new Os({
    parser: ns.parse,
    adapters: [ slack ],
    name: process.env.NAME || 'jarvis',
    icon_url: process.env.ICON_URL || 'https://avatars1.githubusercontent.com/u/24452749?v=3&s=200'
})

os.on('ready', () => {
    winston.info(`assistant ${os.name} ready`)
})

os.use(welcome)
os.use(debug)
os.use(scheduler)

os.hear('wake me up {{date:date}}', (req, res) => {
    // console.log(req.parsed.date)
    // res.reply('ok')
    scheduler.scheduleDateEvent(req.user, 'wake-up', req.parsed.date.start.date())
})

os.hear('wake me up {{occurrence:occurence}}', (req, res) => {
    scheduler.scheduleOccurrenceEvent(req.user, 'wake-up', req.parsed.occurence.laterjs)
})

scheduler.on('event.scheduled', ({ diff, event }) => {
    winston.info('event.scheduled')
    os.speak(event.event.user, 'Roger that!')
})

scheduler.on('event.done.once', ({ event }) => {
    winston.info('event.done.once')
    os.speak(event.event.user, 'let\'s go')
    event.event.finish()
})

scheduler.on('event.done.several.times', ({ event }) => {
    winston.info('event.done.several.times')
    os.speak(event.event.user, 'let\'s go')
})

os.hear('*', (req, res) => {
    res.reply('Sorry, I didn\'t understand your request')
})

os.start()
