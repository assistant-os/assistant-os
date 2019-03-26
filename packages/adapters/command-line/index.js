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
      format: 'text',
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

node.on('data', async ({ type, payload }) => {
  if (type === 'answer-answer') {
    const { format, content } = payload
    if (format === 'text') {
      console.log(content)
    } else if (format === 'list') {
      if (content.action) {
        const { label, multiple, type } = content.action
        if (type === 'select' && multiple) {
          const choices = content.list.map(
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
        content.list.forEach(item => {
          console.log(`${item.title}: ${chalk.blue(item.description)}`)
        })
      }
    } else if (format === 'nothing') {
    }
    requestText()
  }
})

node.start()
