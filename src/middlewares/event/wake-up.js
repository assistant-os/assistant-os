import Middleware from '../../os/middleware'
import scheduler from './scheduler'
import music from '../context/music'

const wakeUp = new Middleware({
  id: 'wake-up',
  description: 'manage alarm clock',
})

wakeUp.hear('wake me up {{date:date}}', (req, res) => {
  scheduler.scheduleDateEvent(req.user, 'wake-up', req.parsed.date.start.date())
})

wakeUp.hear('wake me up {{occurrence:occurence}}', (req, res) => {
  scheduler.scheduleOccurrenceEvent(req.user, 'wake-up', req.parsed.occurence.laterjs)
})

scheduler.on('event.scheduled', ({ diff, event }) => {
  scheduler.log('info', 'event.scheduled')
  if (event.event.name === 'wake-up') {
    wakeUp.state.remove('status')
    wakeUp.speak(event.event.user, 'ok', { random: 'true' })
  }
})

wakeUp.startWakeUp = (event) =>{
  const node = wakeUp.getNexus().getNode('home-spark')
  if (node && node.isConnected() && wakeUp.state.get(event.event.user, '/location') === 'home') {


    console.log('startWakeUp', event.event.user)
    music.startMusic(event.event.user)
    wakeUp.speak(event.event.user, 'Wake up at home!')
  } else {
    wakeUp.speak(event.event.user, 'Wake up!')
  }

  wakeUp.emit('woke-up', { event })
}

scheduler.on('event.date.done', ({ event }) => {
  if (event.event.name === 'wake-up') {
    wakeUp.startWakeUp(event)
    event.event.finish()
  }
})

scheduler.on('event.occurrence.done', ({ event }) => {
  if (event.event.name === 'wake-up') {
    wakeUp.startWakeUp(event)
  }
})

export default wakeUp
