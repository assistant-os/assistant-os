import winston from 'winston'
import path from 'path'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      filename: path.join(__dirname, '.../../.data/error.log.txt'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../.data/combined.log.txt'),
    }),
  ],
})

logger.add(
  new winston.transports.Console({
    format: winston.format.json(),
  })
)

export default logger
