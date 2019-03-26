import Os from '@assistant-os/os'
import Hello from '@assistant-os/hello'
import Movies from '@assistant-os/movies'
import Prototype from '@assistant-os/prototype'
import { env } from '@assistant-os/utils'

env()

const os = new Os({
  name: process.env.NAME,
  port: process.env.PORT,
  token: process.env.TOKEN,
})
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

const prototype = new Prototype({
  token: process.env.TOKEN,
  host: process.env.HOST,
  port: process.env.PORT,
  priority: 5,
})
prototype.start()
