import Core from './core'
import Nexus from './nexus'

import { logger } from '@assistant-os/utils'

export default class Os {
  constructor (options) {
    this.core = new Core(options)
    this.nexus = new Nexus(options)
    this.nexus.on('node', message => {
      this.core.processMessage(message)
    })

    this.core.on('node', message => {
      this.nexus.send(message)
    })

    logger.plug(this.core)
    logger.plug(this.nexus)
  }

  start () {
    this.nexus.start()
    this.core.start()
  }
}
