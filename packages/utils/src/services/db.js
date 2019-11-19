import low from 'lowdb'
import path from 'path'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync(path.join(__dirname, '../../../../data/db.json'))
const db = low(adapter)

// https://www.npmjs.com/package/lowdb

// Set some defaults
db.defaults({}).write()

export default () => db
