// import Core from './core'
// import Nexus from './nexus'

import { logger } from '@assistant-os/utils'

export default class Assistant {
  constructor({
    name = 'Assistant',
    timeout = 15000 /* maximum accepted delay for a response by modules */
  } = {}) {
    this.identity = { name }
    this.timeout = timeout
  }

  start() {
    logger.info(`started ${this.identity.name}`)
    setInterval(() => {}, 1000)
  }

  stop() {
    logger.info(`stopped ${this.identity.name}`)
  }
}
