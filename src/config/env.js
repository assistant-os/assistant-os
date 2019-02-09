import dotenv from 'dotenv'
// setup environment variables
if ('production' !== process.env.NODE_ENV) {
  dotenv.config()
}
