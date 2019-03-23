import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

import Os from '@assistant-os/os'
import Hello from '@assistant-os/hello'
import Movies from '@assistant-os/movies'
import Prototype from '@assistant-os/prototype'

if ('production' !== process.env.NODE_ENV) {
  fs.access(path.resolve(__dirname, '../.env'), fs.constants.F_OK, err => {
    if (err) {
      console.log(
        chalk.bold.red(
          '.env file missing. Please follow the instructions described in doc/env.md file.'
        )
      )
    } else {
      dotenv.config()
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
    }
  })
}
