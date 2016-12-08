const winston = require('winston');
const Slack = require('./media/slack/slack');
const Ai = require('./ai');
const db = require('./db');

const User = require('./models/user')(db);

// use .env file config
require('dotenv').config();

var ai = new Ai();

var slack = new Slack(winston);

var defaultUser = { name: 'friedrit' };

slack.on('ready', function () {
    ai.say( defaultUser, 'hello' );
});

ai.on('say', function (user, message) {
    slack.sendMessage(user, message);
});

slack.on('message', function (user, message) {
    ai.processMessage( defaultUser, message);
});
