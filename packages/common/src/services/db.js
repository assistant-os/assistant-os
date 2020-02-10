import low from 'lowdb'
import fs from 'fs'
import path from 'path'
import FileSync from 'lowdb/adapters/FileSync'

const dataFolder = path.join(__dirname, '../../../../data')

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder)
}

const adapter = new FileSync(path.join(dataFolder, 'db.json'))
const db = low(adapter)

// https://www.npmjs.com/package/lowdb

// Set some defaults
db.defaults({}).write()

export default () => db
