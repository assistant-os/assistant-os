import winston from 'winston'

import db from '../src/config/db'

db.sync({ force: true })
winston.info('synchronization done')
