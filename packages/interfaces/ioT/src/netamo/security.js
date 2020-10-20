const netatmo = require('./netatmo')
const dotenv = require('dotenv')

const ngork = require('../ngrok')

dotenv.config()

const auth = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
}

const test = async () => {
  // const url = await ngork.connect()

  // console.log('url', url)

  await netatmo.authenticate(auth)

  const homes = await netatmo.getHomeData()
  const home = homes[0]

  console.log('home', home.name, home.place, home.cameras)

  const persons = home.persons

  console.log('persons', persons[persons.length - 1])
}

test()
