import path from 'path'
import winston from 'winston'
import fs from 'fs'

const filename = path.resolve(__dirname, '../../logs/combined.log')

try {
  fs.mkdirSync(path.dirname(filename))
} catch {}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      timestamp: true,
      filename,
    }),
  ],
})

export default logger

logger.plug = emitter => {
  emitter.on('info', message => {
    logger.info(message)
  })

  emitter.on('error', message => {
    logger.error(message)
  })
}
