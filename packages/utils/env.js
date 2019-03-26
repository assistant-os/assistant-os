import dotenv from 'dotenv'

import logger from './logger'

export default () => {
  // setup environment variables
  if ('production' !== process.env.NODE_ENV) {
    const result = dotenv.config()

    if (result.error) {
      logger.warning({ message: result.error })
    }
  }
}
