import winston from 'winston'

import state from '../os/state'

import Middleware from '../os/middleware'
import scheduler from './scheduler'
import music from './music'

const wakeUp = new Middleware()

wakeUp.hear('wake me up {{date:date}}', (req, res) => {
    scheduler.scheduleDateEvent(req.user, 'wake-up', req.parsed.date.start.date())
})

wakeUp.hear('wake me up {{occurrence:occurence}}', (req, res) => {
    scheduler.scheduleOccurrenceEvent(req.user, 'wake-up', req.parsed.occurence.laterjs)
})

scheduler.on('event.scheduled', ({ diff, event }) => {
    winston.info('event.scheduled')
    wakeUp.speak(event.event.user, 'Roger that!')
})

scheduler.on('event.date.done', ({ event }) => {
    winston.info('event.date.done')
    if (event.event.name === 'wake-up') {
      const node = wakeUp.getNexus().getNode('home-spark')
      if (node && node.isConnected() && state.get(event.event.user, 'location') === 'home') {
        music.startMusic(event.event.user)
        // wakeUp.speak(event.event.user, 'Wake up at home!')
      } else {
        wakeUp.speak(event.event.user, 'Wake up!')
      }
    } else {
        wakeUp.speak(event.event.user, 'let\'s go')
    }
    event.event.finish()
})

scheduler.on('event.occurrence.done', ({ event }) => {
    winston.info('event.occurrence.done')
    if (event.event.name === 'wake-up') {
        wakeUp.speak(event.event.user, 'Wake up!')
    } else {
        wakeUp.speak(event.event.user, 'let\'s go')
    }
})

export default wakeUp
