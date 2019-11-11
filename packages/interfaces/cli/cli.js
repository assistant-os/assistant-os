import io from 'socket.io-client'
import dotenv from 'dotenv'
import readline from 'readline' // https://nodejs.org/api/readline.html
import path from 'path'
import chalk from 'chalk'

const configPath = path.join(__dirname, '.env')

const printLine = line => process.stdout.write(chalk.green(`${line}\n`))

printLine(`Loading config ${configPath}`)

dotenv.config({ path: configPath })

const secret = process.env.SECRET
const token = process.env.TOKEN
const host = process.env.HOST
const port = process.env.PORT

const url = `${host}:${port}`

const socket = io(url)

printLine(`Connecting to ${url}...`)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

socket.on('connect', () => {
  printLine('Connected.')
  printLine('Type "quit" to quit the cli')
  process.stdout.write('$> ')
  socket.emit('start', { secret, token })
})

socket.on('message', ({ text }) => {
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
  process.stdout.write(`${chalk.blue(text)}\n`)
  process.stdout.write('$> ')
})

rl.on('line', text => {
  if (text === 'quit' || text === 'exit') {
    process.exit(0) // eslint-disable-line
  }

  if (text !== '') {
    socket.emit('message', { secret, token, text })
  }
  process.stdout.write('$> ')
})

rl.on('SIGINT', () => {
  rl.close()
  socket.close()
  process.exit(0)
})

socket.on('connect_error', error => {
  console.error('connect_error', error)
})

socket.on('connect_timeout', timeout => {
  console.error('connect_timeout', timeout)
})

socket.on('error', error => {
  console.error('error', error)
})

/*
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
*/
