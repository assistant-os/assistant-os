import path from 'path'
import winston from 'winston'
import fs from 'fs'

const filename = path.resolve(__dirname, '../../logs/combined.log')
const dirname = path.dirname(filename)

try {
  fs.mkdirSync(dirname)
} catch (error) {
  if (!fs.existsSync(dirname)) {
    // eslint-disable-next-line no-console
    console.log('Impossible to create folder', error)
  }
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      timestamp: true,
      filename
    })
  ]
})

logger.plug = emitter => {
  emitter.on('info', message => {
    logger.info(message)
  })

  emitter.on('error', message => {
    logger.error(message)
  })
}

export default logger
