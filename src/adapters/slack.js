import SlackBot from 'slackbots'
// import util from 'util'
// import EventEmitter from 'event'
// import winston from 'winston'

import Adapter from './adapter'

// import db from '../config/db'
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
        this.config = config
        this.config.token = this.token

        this.bot = new SlackBot({ name: this.config.name, token: this.token })
        this.bot.on('start', () => this.emit('ready'))
        this.bot.on('message', (message) => {
            if (message.username !== this.config.name && message.type === 'message') {
                User.findOne({
                    where: {
                        slackId: message.user
                    }
                }).then((user) => {
                    if (user === null) {
                        this.bot.getUsers().then((slackUsers) => {
                            slackUsers.members.forEach((slackUser) => {
                                if (slackUser.id === message.user) {
                                    User.create({
                                        real_name: slackUser.real_name,
                                        name: slackUser.name,
                                        slackId: slackUser.id
                                    }).then((user) => {
                                        this.emit('message', { user:user, text:message.text, date: new Date() })
                                    })
                                }
                            })
                        })
                    } else {
                        this.emit('message', { user:user, text:message.text, date: new Date() })
                    }
                })
            }
        })
    }

    send (user, message) {
        let content = {
            //"icon_emoji": icon || ":smile:",
            "icon_url": this.config.icon_url,
            "text": message,
            "mrkdwn": true,
            "username": this.config.name,
            "attachments": []
        }



        /*
        if (help) {
            content.attachments.push({
                "text": help,
                "callback_id": "happiness_collection",
                "color": process.env.COLOR,
                "mrkdwn_in": ["text", "pretext"]
            });
        };*/

        this.bot
        .postMessageToUser(user.name, '', content)
        .always((/* data */) => {
        })
    }

}

export default Slack
