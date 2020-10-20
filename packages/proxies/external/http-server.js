import ngrok from 'ngrok'
import express from 'express'
import bodyParser from 'body-parser'

import { config, logger } from '@assistant-os/common'

let url = ''
let app = null
let server = null

const routers = []

const startHttpServer = () =>
  new Promise(resolve => {
    app = express()

    app.use(bodyParser.json())

    app.get('/hello', (req, res) => {
      res.send('hello world')
    })

    routers.forEach(router => {
      const path = router.getPath()
      logger.verbose('load router', { path })
      app.use(path, router.getRouter())
    })

    server = app.listen(config.get('HTTP_PORT'), () => {
      resolve(app)
    })
  })

export const add = router => routers.push(router)

export const start = async () => {
  await stop()

  config.required(['NGROK_TOKEN', 'NGROK_DOMAIN', 'HTTP_PORT'])

  url = await ngrok.connect({
    authtoken: config.get('NGROK_TOKEN'),
    subdomain: config.get('NGROK_DOMAIN'),
    port: config.get('HTTP_PORT'),
  })

  await startHttpServer()

  logger.verbose('proxy started', { url })
}
export const stop = async () => {
  if (url) {
    await ngrok.disconnect(url)
  }

  if (server) {
    server.close()
  }
}

export const get = () => ({
  url,
  app,
})

export default { start, stop, get, add }
