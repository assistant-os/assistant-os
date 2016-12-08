const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');

const Slack = require('./media/slack/slack');
const Ai = require('./ai');
const db = require('./db');

const User = require('./models/user')(db);

try {
    fs.accessSync(path.join(__dirname, '../../.env'), fs.R_OK);
    // use .env file config
    require('dotenv').config();
} catch (e) {}

var ai = new Ai();

var slack = new Slack(winston);

slack.on('ready', function () {
    // ai.say( defaultUser, 'hello' );
});

ai.on('say', function (user, message) {
    slack.sendMessage(user, message);
});

slack.on('message', function (user, message) {
    // garantee : user has name, real_name, slackId
    ai.processMessage(user, message);
});
