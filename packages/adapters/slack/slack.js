import uuidv1 from 'uuid/v1'
import { Adapter, Users, logger } from '@assistant-os/common'
import { WebClient } from '@slack/web-api'
// import { createEventAdapter } from '@slack/events-api'
import { RTMClient } from '@slack/rtm-api'

export default class Slack extends Adapter {
  constructor() {
    super('slack')

    this.users = new Users(this.name)
  }

  start() {
    return new Promise(async resolve => {
      // https://github.com/slackapi/node-slack-sdk
      this.web = new WebClient(process.env.ADAPTER_SLACK_TOKEN)
      /*
      this.slackEvents = createEventAdapter(process.env.ADAPTER_SLACK_SIGNING_SECRET)

      this.slackEvents.on('message', event => {
        const message = { text: event.text }
        this.emit('message', { user: event.user, message })
      })

      // Handle errors (see `errorCodes` export)
      this.slackEvents.on('error', error => {
        this.emit('error', error)
      })

      await this.slackEvents.start(process.env.ADAPTER_SLACK_PORT || 3000)
      */

      this.rtm = new RTMClient(process.env.ADAPTER_SLACK_TOKEN)

      await this.rtm.start()

      this.rtm.on('message', async event => {
        let user = this.users.findOrCreateByAdapter(event.user, {
          channel: event.channel,
        })

        if (user.name === 'unknown') {
          try {
            const { user: slackUser } = await this.web.users.info({
              user: event.user,
            })
            this.users.update(user.id, {
              name: slackUser.profile.real_name_normalized,
            })
          } catch (error) {
            logger.error('error while getting user info', { error })
          }
        }

        user = this.emit('message', {
          userId: user.id,
          id: uuidv1(),
          text: event.text.replace(/<(.+?)|.+?>/g, '$1'),
        })
      })

      this.rtm.on('ready', async () => {
        resolve()
      })
    })
  }

  stop() {}

  async sendMessage(userId, message) {
    const user = this.users.findById(userId)

    let { text } = message
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<$2|$1>')

    // this.web.chat.postMessage({ channel: user.channel, ...message })
    this.rtm.sendMessage(text, user.adapter.meta.channel)
  }

  async sendAction(userId, action) {
    const user = this.users.findById(userId)
    if (action.type === 'typing') {
      this.rtm.sendTyping(user.adapter.meta.channel)
    }
  }
}
