import Assistant from './assistant'

const assistant = new Assistant({
  port: process.env.PORT,
  token: process.env.TOKEN,
})

assistant.start()
