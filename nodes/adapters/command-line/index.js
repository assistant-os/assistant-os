import { prompt } from 'enquirer'
import chalk from 'chalk'

import { WebSocketAdapter, env } from '@assistant-os/utils'

let promptDisplayed = false

env()

const requestText = async () => {
  if (promptDisplayed) {
    return
  }
  promptDisplayed = true
  const response = await prompt({
    type: 'input',
    name: 'sentence',
    message: '>',
  })
  promptDisplayed = false

  if (response.sentence === 'quit' || response.sentence === 'exit') {
    process.exit(0)
  } else {
    node.send('message', {
      content: response.sentence,
    })
  }
}

const node = new WebSocketAdapter({
  token: process.env.TOKEN,
  host: process.env.HOST,
  port: process.env.PORT,
  label: 'command-line',
  priority: 5,
  type: 'adapter',
})

node.on('registered', async () => {
  requestText()
})

node.on('message', async ({ type, payload }) => {
  if (type === 'answer-answer') {
    const { content } = payload
    if (content.type === 'text') {
      console.log(payload.content.text)
    } else if (content.type === 'list') {
      if (content.action) {
        const { label, multiple, type } = content.action
        if (type === 'select' && multiple) {
          const choices = payload.content.list.map(
            item => `${item.title}: ${chalk.blue(item.description)}`
          )
          await prompt({
            type: 'multiselect',
            name: 'choice',
            message: label,
            choices,
          })
        }
      } else {
        payload.content.list.forEach(item => {
          console.log(`${item.title}: ${chalk.blue(item.description)}`)
        })
      }
    } else if (content.type === 'nothing') {
    }
    requestText()
  }
})

node.start()
