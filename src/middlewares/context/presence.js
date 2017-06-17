import Middleware from '../../os/middleware'
import state from '../../os/state'

let presence = new Middleware('presence')

presence.hear('where am i', (req, res) => {
  if (state.get(req.user) && state.get(req.user, 'location') !== 'unknown') {
    if (state.get(req.user, 'location') === 'home') {
      res.reply('You are at home.')
    } else if (state.get(req.user, 'location') === 'outside') {
        res.reply('You are not at home.')
    } else {
      res.reply(`You are in ${state.get(req.user, 'location') }.`)
    }
  } else {
    res.reply('Sorry but I don\'t know where you are.')
  }
})

presence.hear('i am at home', (req, res) => {
  state.set(req.user, 'location', 'home')
  res.reply('Ok roger that!')
})

presence.hear('i am not at home', (req, res) => {
  state.set(req.user, 'location', 'outside')
  res.reply('Ok roger that!')
})

export default presence
