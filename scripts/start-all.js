import dotenv from 'dotenv'

import Os from '@assistant-os/os'
import Hello from '@assistant-os/hello'
import Movies from '@assistant-os/movies'

if ('production' !== process.env.NODE_ENV) {
  dotenv.config()
}

const os = new Os()
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
