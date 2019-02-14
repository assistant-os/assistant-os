import 'config/env'
import { plugLogger } from 'config/logger'

// import webhookCatcher from 'webhook-catcher'

import { Os, Nexus } from './os'
import { Hello } from './nodes/modules'

// import Node from "./os/node"
//
// import { Slack } from "./adapters"
// import {
//   admin,
//   welcome,
//   security,
//   eventManager,
//   contextManager,
//   profile
// } from "./middlewares"
//
// let slack = new Slack({
//   token: process.env.SLACK_API_TOKEN
// })
//
// slack.on('restart', () => {
//   winston.info('slack restarting')
// })
//
// slack.on('ready', () => {
//   winston.info('slack ready')
//   os.speak(process.env.SLACK_ADMIN, 'I am now online!')
// })
//
// let os = new Os({
//   parser: ns.parse,
//   adapters: [ slack ],
//   name: process.env.NAME || 'jarvis',
//   icon_url:
//     process.env.ICON_URL ||
//     'https://avatars1.githubusercontent.com/u/24452749?v=3&s=200',
//   response_time: text => {
//     if (text) {
//       return text.length * 40
//     } else {
//       return 0
//     }
//   }
// })
//
// const routers = {}
//
// os.nexus = new Nexus({
//   port: process.env.PORT,
//   nodes: [ home ],
//   routers: routers
// })
//
// os.on('ready', () => {
//   winston.info(`assistant ${os.name} ready`)
// })
//
// os.on('log', ({ status, event, payload }) => {
//   winston.log(status, { ...payload, event })
// })
//
// os.use(welcome)
// os.use(admin)
// os.use(eventManager)
// os.use(security)
// os.use(contextManager)
// os.use(profile)

// scheduler.on('event.scheduled', ({ diff, event }) => {
//     winston.info('event.scheduled')
//     os.speak(event.event.user, 'Roger that!')
// })
//
// scheduler.on('event.done.once', ({ event }) => {
//     winston.info('event.done.once')
//     if (event.event.name === 'wake-up') {
//         os.speak(event.event.user, 'Wake up!')
//     } else {
//         os.speak(event.event.user, 'let\'s go')
//     }
//     event.event.finish()
// })
//
// scheduler.on('event.done.several.times', ({ event }) => {
//     winston.info('event.done.several.times')
//     if (event.event.name === 'wake-up') {
//         os.speak(event.event.user, 'Wake up!')
//     } else {
//         os.speak(event.event.user, 'let\'s go')
//     }
// })

// os.hear('*', (req, res) => {
//   res.reply('Sorry, I didn\'t understand your request')
// })
//
// os.start()

const nexus = new Nexus({ token: process.env.TOKEN, port: process.env.PORT })
plugLogger(nexus)

const os = new Os({ name: process.env.NAME })
plugLogger(os)

nexus.on('node', message => {
  os.processMessage(message)
})

os.on('node', message => {
  nexus.send(message)
})

nexus.start()
os.start()

const hello = new Hello()
hello.register()
hello.on('connected', () => {
  console.log('connected')
})
