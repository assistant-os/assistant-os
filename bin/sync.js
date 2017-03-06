var winston = require('winston')

var db = require('../src/config/db')

db.sync({ force: true })
winston.info('synchronization done')
