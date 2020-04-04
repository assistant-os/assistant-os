import { promises as fs, constants } from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const filename = path.join(__dirname, '../../.data/data.sqlite')

let db = null

export const sequelize = () => db

export const init = async (
  database = 'database',
  username = 'username',
  password = 'password'
) => {
  if (!db) {
    const dirname = path.dirname(filename)

    await fs
      .access(dirname, constants.R_OK | constants.W_OK)
      .catch(() => fs.mkdir(dirname))

    db = new Sequelize(database, username, password, {
      dialect: 'sqlite',
      storage: filename,
    })
  }

  return Promise.resolve()
}
