import Middleware from '../os/middleware'

let welcome = new Middleware('welcome')

welcome.hear('*', (req, res, next) => {
  if (welcome.state.get(req.user, 'status') === 'waiting-for-name') {
    res.reply(`Ok so your name is "${req.text}"?`)
    welcome.state.set(req.user, 'status', 'waiting-for-confirmation')
    welcome.state.set(req.user, 'name', req.text)
  } else {
    next()
  }
})

welcome.hear([ 'hello', 'hi', 'good morning', 'good afternoon', 'good evening' ], (req, res) => {

  const name = req.user.real_name ? ` ${req.user.real_name}` : ''

  res.replyRandomly([ `Hello${name}`, `Hi${name}`, () => {
    if (req.date.getHours() < 11) {
      return `Good morning${name}!`
    } else if (req.date.getHours() < 18) {
      return `Good afternoon${name}!`
    } else if (req.date.getHours() < 23) {
      return `Good evening${name}!`
    } else {
      return `Good night${name}!`
    }
  } ])


  if (req.user.real_name) {
      res.reply('What can I do for you?')
  } else {
    res.reply('Nice to meet you !')
    res.reply(`My name is ${welcome.config().name}.`)
    res.reply(`And you what is your name?`)
    welcome.state.set(req.user, 'status', 'waiting-for-name')
    welcome.state.set(req.user, 'origin', 'hello')
  }

})

welcome.hear([ 'cancel', 'forget', 'forget it' ], (req, res, next) => {
  if (welcome.state.get(req.user, 'status')) {
    welcome.state.remove(req.user, 'status')
    welcome.state.remove(req.user, 'origin')
    res.reply('Ok')
  } else {
    next()
  }

})

welcome.hear([ 'yes', 'ouep' ], (req, res, next) => {
  if (welcome.state.get(req.user, 'status') === 'waiting-for-confirmation') {
    req.user.real_name = welcome.state.get(req.user, 'name')
    req.user.save()
    res.reply(`Roger that.`)
    if (welcome.state.get(req.user, 'origin') === 'hello') {
      res.reply(`Welcome ${welcome.state.get(req.user, 'name')}!`)
      res.reply('Can I do for you?')
    }
    welcome.state.remove(req.user, 'status')
    welcome.state.remove(req.user, 'origin')
  } else {
    next()
  }
})

welcome.hear([ 'no', 'nope' ], (req, res, next) => {
  if (welcome.state.get(req.user, 'status') === 'waiting-for-confirmation') {
    res.reply(`So what is your name?`)
    welcome.state.set(req.user, 'status', 'waiting-for-name')
  } else {
    next()
  }
})

welcome.hear([ 'thanks', 'thx', 'thank you' ], (req, res, next) => {
  res.reply(`You are welcome ${req.user.real_name}!`)
})

welcome.hear([ 'help', 'help me' ], (req, res, next) => {
  res.reply(`My name is ${os.config().name} and I am here to help in repetitive tasks.`)
  // res.reply(`You are welcome ${req.user.real_name}!`)
})

welcome.hear([ 'call me differently', 'change my name' ], (req, res, next) => {
  welcome.state.set(req.user, 'status', 'waiting-for-name')
  welcome.state.set(req.user, 'origin', 'new-name')
  res.reply(`Tell me your new name.`)
})

export default welcome
