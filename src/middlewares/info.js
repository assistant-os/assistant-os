import Middleware from '../os/middleware'
import state from '../os/state'
import User from '../models/user'
import Info from '../models/info'

let info = new Middleware()

//
info.hear([
  'remember new private information',
  'remember new information',
  'add info',
  'add private info'
], (req, res) => {
    res.reply('Ok now give me keywords to describe your piece of information like *password* *wifi* *home*.')
    res.reply('Separate the words with spaces.')
    res.reply('Use order `cancel` and I will stop waiting for your input and cancel this request.')
    state.set(req.user, 'status', 'waiting-for-description')
})

info.hear('cancel', (req, res, next) => {
  if (state.get(req.user)) {
    if (state.get(req.user, 'status') === 'waiting-for-description') {
      state.remove(req.user)
      res.reply('Ok I cancel to remember this piece of information')
      return
    }
  }
  next()
})

info.hear([
  'get info'
], (req, res) => {

})

info.hear('*', (req, res, next) => {
  if (state.get(req.user)) {
    if (state.get(req.user, 'status') === 'waiting-for-description') {
      state.set(req.user, 'description', req.text)
      state.set(req.user, 'status', 'waiting-for-value')
      res.reply('Ok, now give me the value of your piece of information')
      return
    } else if (state.get(req.user, 'status') === 'waiting-for-value') {
      state.remove(req.user)
      res.reply('Ok I get it')
      return
    }
  }

  next()
})

export default info
