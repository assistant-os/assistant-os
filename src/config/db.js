import Sequelize from 'sequelize'
import path from 'path'
import fs from 'fs-extra'

import directories from './directories'

fs.ensureDirSync(directories.data)

export default new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false,
  // SQLite only
  storage: path.join(directories.data, 'data.sqlite')
})
