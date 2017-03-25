import winston from 'winston'
import ns from 'natural-script'
import dotenv from 'dotenv'

import Os from './os/os'

import Nexus from './os/nexus'
import Node from './os/node'

import { Slack } from './adapters'
import { admin, scheduler, welcome, safeKeeper } from './middlewares'

import User from './models/user'

if ('production' !== process.env.NODE_ENV) {
    dotenv.config()
}

let slack = new Slack({
    token: process.env.SLACK_API_TOKEN
})

slack.keepAlive()

slack.on('restart', () => {
    winston.info('slack restarting')
})

slack.on('ready', () => {
    winston.info('slack ready')
    os.speak(process.env.SLACK_ADMIN, 'I am now online!')
})

let os = new Os({
    parser: ns.parse,
    adapters: [ slack ],
    name: process.env.NAME || 'jarvis',
    icon_url: process.env.ICON_URL || 'https://avatars1.githubusercontent.com/u/24452749?v=3&s=200',
    response_time: (text) => {
        if (text) {
            return text.length * 40
        } else {
            return 0
        }
    }
})

let home = new Node({
    id: process.env.HOME_SPARK_ID,
    name: 'home',
    token: process.env.HOME_SPARK_TOKEN,
    description: ''
})

home.behaviors = [
    {
        type: 'watch-presence',
        device: {
            ip: process.env.COMPANION_IP,
        },
        callback: (event) => {
            if (event.device.ip === process.env.COMPANION_IP) {
                if (event.currentState && !event.previousStatus) {
                    os.speak(process.env.COMPANION_OWNER, 'Welcome home!')
                } else {
                    os.speak(process.env.COMPANION_OWNER, 'Go back soon.')
                }
            } else {
                winston.info('unmanaged event', { event: event })
            }

        }
    }
]

let nexus = new Nexus({
    port: process.env.PORT,
    nodes: [
        home
    ]
})

os.on('ready', () => {
    winston.info(`assistant ${os.name} ready`)
})

os.hear('*', (req, res, next) => {
    if (req.text.toLowerCase() === 'help') {
        res.reply(`My name is ${os.config().name} and I am here to help in repetitive tasks.`)
    } else {
        next()
    }
})

os.use(welcome)
os.use(admin)
os.use(scheduler)
os.use(safeKeeper)


os.hear('wake me up {{date:date}}', (req, res) => {
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
    if (event.event.name === 'wake-up') {
        os.speak(event.event.user, 'Wake up!')
    } else {
        os.speak(event.event.user, 'let\'s go')
    }
    event.event.finish()
})

scheduler.on('event.done.several.times', ({ event }) => {
    winston.info('event.done.several.times')
    if (event.event.name === 'wake-up') {
        os.speak(event.event.user, 'Wake up!')
    } else {
        os.speak(event.event.user, 'let\'s go')
    }
})

admin.on('reinitialized', () => {
    os.speak(process.env.SLACK_ADMIN, 'Reinitialization done.')
})


os.hear('*', (req, res) => {
    res.reply('Sorry, I didn\'t understand your request')
})

home.on('connected', () => {
    os.speak(process.env.SLACK_ADMIN, 'Home Spark is now connected.')
    // winston.info('home sweet home')
})

home.on('disconnected', () => {
    os.speak(process.env.SLACK_ADMIN, 'Home Spark is now disconnected.')
    // winston.info('see you soon')
})

nexus.start()

os.start()
