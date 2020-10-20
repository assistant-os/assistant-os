import externalProxy from '@assistant-os/proxy-external'
import { logger, config } from '@assistant-os/common'
import slack from '@assistant-os/slack'
import chat from '@assistant-os/chat'
import hub from '@assistant-os/proxy-hub'

import presence from './presence'
import scenarios from './scenarios'
import homeHttp from './http'

const start = async () => {
  try {
    await config.start()
    await logger.start()
    await scenarios.start()

    await homeHttp.start()
    externalProxy.add(homeHttp)
    await externalProxy.start()

    await slack.start()
    chat.adapters = [slack]
    await chat.start()

    await hub.start()
    await presence.start()

    presence.on('event', ({ when }) => {
      const scenario = scenarios.findOneWhen(when)

      if (scenario) {
        logger.verbose('event', { when, then: scenario.then })
        hub.execute(scenario.then)
      }
    })

    chat.on('message', ({ text }) => {
      hub.execute(text)
    })

    const status = await presence.status()

    logger.info('ready', { status })
  } catch (error) {
    logger.error(error.message)
  }
}

export default { start }
