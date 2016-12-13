const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');

const Slack = require('./media/slack/slack');
const Ai = require('./ai');
const db = require('./db');

const User = require('./models/user')(db);

// check and setup environment variables
try {
    fs.accessSync(path.join(__dirname, '../../.env'), fs.R_OK);
    // use .env file config
    require('dotenv').config();
} catch (e) {}

if (!process.env.SLACK_API_TOKEN) {
    throw new Error('process.env.SLACK_API_TOKEN not defined');
}

if (!process.env.COLOR) {
    process.env.COLOR = '#3f51b5';
}

if (!process.env.NAME) {
    process.env.NAME = 'assistant';
}

if (!process.env.MODULES) {
    process.env.MODULES = '';
}

if (!process.env.MODULES_PATH) {
    process.env.MODULES_PATH = '.';
}

// find intern and extern modules
var modules = [ require('./modules') ];
process.env.MODULES.split(',').forEach(function (moduleName) {
    modules.push( require('./../../'+process.env.MODULES_PATH+moduleName));
});

var ai = new Ai();

// load modules into the ai
modules.forEach(function (module) {
    module(ai);
});

var slack = new Slack(winston);

slack.on('ready', function () {
    ai.ready();
    // ai.say( defaultUser, 'hello' );
});

ai.on('say', function (user, message) {
    slack.sendPrettyMessage(user, message);
});

slack.on('message', function (user, message) {
    // garantee : user has name, real_name, slackId
    ai.processMessage(user, message);
});
