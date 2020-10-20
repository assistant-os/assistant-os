import path from 'path'
import winston from 'winston'
import fs from 'fs'

import config from '../utils/config'

const filename = path.resolve(__dirname, '../../../../data/combined.log')
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
  level: 'verbose',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      timestamp: true,
      filename,
    }),
  ],
})

logger.plug = emitter => {
  emitter.on('info', message => {
    logger.info(message)
  })

  emitter.on('error', message => {
    logger.error(message)
  })
}

logger.start = () => {
  logger.configure({
    level: config.get('LEVEL') || 'info',
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        timestamp: true,
        filename,
      }),
    ],
  })
}

export default logger
