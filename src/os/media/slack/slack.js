const SlackBot = require('slackbots');
const util = require('util');
const EventEmitter = require('events');
const winston = require('winston');

const db = require('../../config/db');
const User = require('../../models/user');

function Slack () {
    EventEmitter.call(this);
    var Slack = this;

    this.config = {
        token: process.env.SLACK_API_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
        name: process.env.NAME
    };

    this.bot = new SlackBot(Slack.config);

    this.bot.on('start', function() {
        winston.info('bot started', { config: Slack.config});
        Slack.emit('ready');
    });

    this.bot.on('message', function (message) {
        // console.log(message.user, message.username);
        if (message.username != Slack.config.name && message.type == 'message') {
            winston.info('message posted by user', {message: message});


            User.findOne({
                where: {
                    slackId: message.user
                }
            }).then((user) => {
                // console.log(user);

                if (user === null) {
                    Slack.bot.getUsers().then(function (slackUsers) {
                        slackUsers.members.forEach(function (slackUser) {
                            if (slackUser.id == message.user) {
                                User.create({
                                    real_name: slackUser.real_name,
                                    name: slackUser.name,
                                    slackId: slackUser.id
                                }).then(function (user) {
                                    Slack.emit('message', user , message.text);
                                });
                            }
                        });
                    });
                } else {
                    Slack.emit('message', user , message.text);
                }
            });



        }
    });

    this.sendMessage = function (user, message, help, callback) {
        /*if (help === null || help === undefined) {
            help = null;
        }*/
        Slack.bot.postMessageToUser(user.name, message, help).always(function(data) {
            winston.info('message posted by bot to '+user.name, {data: data});
            callback && callback(data);
        });
    };

    this.sendAdvancedMessage = function (user, message, help, icon, callback) {
        var content = {
            //"icon_emoji": icon || ":smile:",
            "icon_url": process.env.ICON_URL,
            "text": message,
            "mrkdwn": true,
            "username": Slack.config.name,
            "attachments": []
        };

        if (help) {
            content.attachments.push({
                "text": help,
                "callback_id": "happiness_collection",
                "color": process.env.COLOR,
                "mrkdwn_in": ["text", "pretext"]
            });
        };

        Slack.sendMessage(user, '', content, callback);
    };
}

util.inherits(Slack, EventEmitter);

module.exports = Slack;
