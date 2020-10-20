import EventEmitter from 'events'

import express from 'express'

import { config, logger } from '@assistant-os/common'

import presence from './presence'
import scenarios from './scenarios'

class Http extends EventEmitter {
  start() {
    config.required(['HTTP_TOKEN'])

    this.router = express.Router()

    this.router.use((req, res, next) => {
      if (req.headers.token === config.get('HTTP_TOKEN')) {
        next()
      } else {
        res.sendStatus(401)
      }
    })

    this.router.get('/status', async (req, res) => {
      res.send(await presence.status())
    })

    this.router.get('/scenarios', async (req, res) => {
      res.send(scenarios.getAll())
    })

    this.router.put('/scenarios', async (req, res) => {
      res.send(scenarios.getAll())
    })
  }

  stop() {}

  getRouter() {
    return this.router
  }

  getPath() {
    return '/home'
  }
}

const http = new Http()

export default http
