const ngrok = require('ngrok')

const connect = () => ngrok.connect({ authtoken: process.env.NGROK_TOKEN })

module.exports = { connect }
