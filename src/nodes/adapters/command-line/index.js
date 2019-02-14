// import chalk from 'chalk'
import { prompt } from 'enquirer'

import WebSocketNode from 'nodes/libs/websocket-node'

import 'config/env'

const node = new WebSocketNode({
  token: process.env.TOKEN,
  host: process.env.HOST,
  port: process.env.PORT,
  label: 'command-line',
  priority: 5,
  type: 'adapter'
})

node.on('registered', async () => {
  while (1) {
    const response = await prompt({
      type: 'input',
      name: 'sentence',
      message: '>'
    })

    if (response.sentence === 'quit' || response.sentence === 'exit') {
      process.exit(0)
    } else {
      node.socket.emit('message', {
        type: 'message',
        token: process.env.TOKEN,
        payload: {
          content: response.sentence
        }
      })
    }
  }
})

node.register()
