import winston from 'winston'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' })
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