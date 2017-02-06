const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');

require('./config/default'); // initialize default environment variables


const Slack = require('./media/slack/slack');
const Ai = require('./ai');
const db = require('./config/db');

const Reminder = require('./models/reminder');
const User = require('./models/user');

const humanReadable = require('./helpers/human-readable');

// const SlackUser = require('./media/slack/slack-user');

var os = {
    helpers: {
        humanReadable: humanReadable
    },
    models: {
        User: User
    },
    db: db
};

var modules = [ require('./modules') ];
process.env.MODULES.split(',').forEach(function (moduleName) {
    if( moduleName != '') {
        modules.push( require('./../../'+process.env.MODULES_PATH+moduleName));
    }
});

var media = new Slack();

var ai = new Ai(os);

modules.forEach(function (module) {
    module(ai);
});

media.on('ready', () => {
    ai.start();
});

ai.on('say', (user, message) => {
    media.sendAdvancedMessage(user, message);
});

media.on('message', (user, message) => {
    // garantee : user has name, real_name, slackId
    ai.processMessage(user, message);
});



// find intern and extern modules


// var defaultUser = {
//     slackId: 'U2TS4D7NW',
//     name: 'friedrit',
//     real_name: 'Thibault Friedrich'
// };

// ai.defaultUser = defaultUser;

// load modules into the ai
