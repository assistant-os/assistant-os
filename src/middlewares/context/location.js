import Middleware from '../../os/middleware'

let location = new Middleware('location')

location.hear('where am i', (req, res) => {
  if (location.state.get(req.user, '/location') === 'home') {
    res.reply('You are at home.')
  } else if (location.state.get(req.user, '/location') === 'outside') {
    res.reply('You are not at home.')
  } else if (location.state.get(req.user, '/location') === null) {
    res.reply('Sorry but I don\'t know where you are.')
  } else {
    res.reply(`You are in ${location.state.get(req.user, '/location') }.`)
  }
})

location.hear('i am at home', (req, res) => {
  location.state.set(req.user, '/location', 'home')
  res.reply('Ok roger that!')
})

location.hear('i am not at home', (req, res) => {
  location.state.set(req.user, '/location', 'outside')
  res.reply('Ok roger that!')
})

export default location
