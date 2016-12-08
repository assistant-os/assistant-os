const SlackBot = require('slackbots');
const util = require('util');
const EventEmitter = require('events');

function Slack (winston) {
    EventEmitter.call(this);
    var Slack = this;

    var config = {
        token: process.env.SLACK_API_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
        name: process.env.NAME
    };

    this.bot = new SlackBot(config);

    this.bot.on('start', function() {
        winston.info('bot started', { config: config});
        Slack.emit('ready');
    });

    this.bot.on('message', function (message) {
        // console.log(message.user, message.username);
        if (message.username != config.name && message.type == 'message') {
            winston.info('message posted by user', {message: message});
            Slack.emit('message', { name: message.user } , message.text);
        }
    });

    this.sendMessage = function (user, message, help, callback) {
        Slack.bot.postMessageToUser(user.name, message, help).always(function(data) {
            winston.info('message posted by bot to '+user.name, {data: data});
            callback && callback(data);
        });
    };

    this.sendPrettyMessage = function (user, message, help, icon, callback) {
        var content = {
            "icon_emoji": icon || ":smile:",
            "text": message,
            "mrkdwn": true,
            "username": config.name,
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

        Slack.sendMessage(user, content, callback);
    };
}

util.inherits(Slack, EventEmitter);

module.exports = Slack;
