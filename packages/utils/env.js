import dotenv from 'dotenv'

export default () => {
  // setup environment variables
  if ('production' !== process.env.NODE_ENV) {
    dotenv.config()
  }
}
