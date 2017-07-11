import winston from 'winston'

import { version } from '../../package.json'
import Middleware from '../os/middleware'

import db from '../config/db'

let admin = new Middleware('admin')

admin.hear('date', (req, res) => {
  res.reply((new Date()).toString())
})

admin.hear('version', (req, res) => {
  res.reply(version)
})

admin.hear('name', (req, res) => {
  res.reply(req.os.name)
})

admin.hear([ 'middleware list', 'list middleware' ], (req, res) => {

  // find root middleware
  let middleware = this
  let parent = admin.parent
  while (parent) {
    middleware = parent
    parent = parent.parent
  }

  const os = middleware
  os.list((currentMiddleware, next) => {
    res.reply(`${currentMiddleware.getPathId()}: ${currentMiddleware.enabled ? 'enabled' : 'disabled'}`)
    next()
  }, () => {
    res.reply('finished!')
  })
})

admin.hear([ 'middleware enable', 'enable middleware' ], (req, res) => {

  // find root middleware
  let middleware = this
  let parent = admin.parent
  while (parent) {
    middleware = parent
    parent = parent.parent
  }

  const os = middleware

  os.list((currentMiddleware, next) => {
    res.reply(`${currentMiddleware.getPathId()}: ${currentMiddleware.enabled ? 'enabled' : 'disabled'}`)
    next()
  }, () => {
    res.reply('finished!')
  })
})


admin.hear('*', (req, res, next) => {
  if (req.text.toLowerCase() === 'reinitialize') {
    admin.state.set(req.user, 'status', 'waiting-for-confirmation')
    res.reply('Are you sure (yes/no)?')
  } else if (req.text.toLowerCase() === 'yes' && admin.state.get(req.user, 'status') === 'waiting-for-confirmation') {
    res.reply('Reiniatialization pending')
    db.sync({ force: true })
    .then(() => {
      winston.info('reiniatialization done')
      admin.emit('reinitialized')
      admin.state.remove(req.user, 'status')
    })
    .catch((e) => {
      winston.error('reiniatialization error', { error:e })
      admin.state.remove(req.user, 'status')
    })
    delete cache[req.user.id]
  } else if (req.text.toLowerCase() === 'no' && admin.state.get(req.user, 'status') === 'waiting-for-confirmation') {
    res.reply('Reiniatialization cancelled')
    admin.state.remove(req.user, 'status')
  } else {
    admin.state.remove(req.user, 'status')
    next()
  }

})

export default admin
