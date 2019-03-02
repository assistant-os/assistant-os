import 'shared'
import { plugLogger } from 'shared/logger'

import { Os, Nexus } from './os'
import { Hello, Movies } from './nodes/modules'

const nexus = new Nexus({ token: process.env.TOKEN, port: process.env.PORT })
plugLogger(nexus)

const os = new Os({ name: process.env.NAME })
plugLogger(os)

nexus.on('node', message => {
  os.processMessage(message)
})

os.on('node', message => {
  nexus.send(message)
})

nexus.start()
os.start()

const hello = new Hello({
  token: process.env.TOKEN,
  host: process.env.HOST,
  port: process.env.PORT,
  priority: 5,
})
hello.start()

const movies = new Movies({
  token: process.env.TOKEN,
  apiKey: process.env.THEMOVIEDB_API_KEY,
  host: process.env.HOST,
  port: process.env.PORT,
  priority: 5,
})
movies.start()
