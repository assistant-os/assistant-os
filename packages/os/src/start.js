import Assistant from './assistant'

const assistant = new Assistant({
  name: process.env.NAME,
  port: process.env.PORT,
  token: process.env.TOKEN,
})

assistant.start()
