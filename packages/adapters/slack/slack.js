import uuidv1 from 'uuid/v1'
import { Adapter, Users, logger, config } from '@assistant-os/common'
// import { WebClient } from '@slack/web-api'
import { RTMClient } from '@slack/rtm-api'

class Slack extends Adapter {
  constructor() {
    super('slack')

    this.users = {
      admin: '',
    }
  }

  start() {
    return new Promise(async resolve => {
      config.required(['SLACK_TOKEN', 'SLACK_CHANNEL'])

      // https://github.com/slackapi/node-slack-sdk
      // this.web = new WebClient(config.get('ADAPTER_SLACK_TOKEN'))

      this.rtm = new RTMClient(config.get('SLACK_TOKEN'))

      await this.rtm.start()

      this.rtm.on('message', async event => {
        logger.info('slack', { text: event.text })
        this.emit('message', {
          id: uuidv1(),
          text: event.text.replace(/<(.+?)|.+?>/g, '$1'),
        })
      })

      this.rtm.on('ready', async () => {
        logger.verbose('slack communication started')

        resolve()
      })
    })
  }

  stop() {}

  async speak(message) {
    // logger.info('channel', { channel: config.get('SLACK_CHANNEL') })
    this.rtm.sendMessage(message.text, config.get('SLACK_CHANNEL'))
  }
}

const slack = new Slack()

export default slack
