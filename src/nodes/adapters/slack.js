import SlackBot from 'slackbots'

import Adapter from '../os/adapter'
import User from '../models/user'

class Slack extends Adapter {
  constructor (opts) {
    super()
    if (!opts.token) {
      throw 'missing token'
    }
    this.token = opts.token
  }

  start (config) {
    if (config) {
      this.config = config
      this.config.token = this.token
    }

    this.bot = new SlackBot({ name: this.config.name, token: this.token })
    this.bot.on('start', () => this.emit('ready'))
    this.bot.on('message', message => {
      if (message.username !== this.config.name && message.type === 'message') {
        let text = message.text.replace(
          /\<mailto\:(.+)\|.+\>/g,
          (match, p1) => {
            return p1
          }
        )

        text = text.replace(/\<(.+)\|(.+)\>/g, (match, p1, p2) => {
          return p2
        })

        this.findUser({
          id: message.user
        }).then(user => {
          this.emit('message', { user: user, text: text, date: new Date() })
        })
      }
    })
  }

  keepAlive () {
    setInterval(() => {
      this.emit('restart')
      delete this.bot
      this.start()
    }, 1000 * 60 * 60 * 24)
  }

  send (user, message) {
    let content = {
      //"icon_emoji": icon || ":smile:",
      icon_url: this.config.icon_url,
      text: message,
      mrkdwn: true,
      username: this.config.name,
      attachments: []
    }

    return this.findUserTmp(user)
      .then(slackUser => {
        this.bot
          .postMessageToUser(slackUser.name, '', content)
          .always((/* data */) => {})
      })
      .catch(() => {
        console.log('error')
      })
  }

  // TODO clean this method
  findUserTmp (user) {
    return new Promise((resolve, reject) => {
      if (typeof user === 'string') {
        return this.findUser({
          name: user
        })
          .then(slackUser => {
            resolve(slackUser)
          })
          .catch(() => {
            reject()
          })
      } else {
        resolve(user)
      }
    })
  }

  // TODO clean this method
  findUser (opts) {
    let where = {}
    if (opts) {
      if (opts.slackId) {
        where.slackId = opts.id
      }

      if (opts.name) {
        where.name = opts.name
      }
    }
    return new Promise((resolve, reject) => {
      User.findOne({
        where: where
      }).then(user => {
        if (user === null) {
          this.bot.getUsers().then(slackUsers => {
            slackUsers.members.forEach(slackUser => {
              if (
                (where.slackId && slackUser.id === opts.id) ||
                (where.name && slackUser.name === opts.name)
              ) {
                User.create({
                  real_name: slackUser.real_name,
                  name: slackUser.name,
                  slackId: slackUser.id
                })
                  .then(user => {
                    if (user) {
                      resolve(user)
                    } else {
                      reject()
                    }
                    // this.emit('message', { user:user, text:text, date: new Date() })
                  })
                  .catch(e => {
                    reject(e)
                  })
              }
            })
          })
        } else {
          resolve(user)
          // this.emit('message', { user:user, text:text, date: new Date() })
        }
      })
    })
  }
}

export default Slack
