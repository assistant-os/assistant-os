const fs = require('fs');
const path = require('path');
// check and setup environment variables

try {
    fs.accessSync(path.join(__dirname, '../../../.env'), fs.R_OK);
    // use .env file config
    require('dotenv').config();
} catch (e) {
    console.log(e);
}



if (!process.env.SLACK_API_TOKEN) {
    throw new Error('process.env.SLACK_API_TOKEN not defined');
}

if (!process.env.COLOR) {
    process.env.COLOR = '#3f51b5';
}

if (!process.env.NAME) {
    process.env.NAME = 'assistant';
}

if (!process.env.ICON_URL) {
    process.env.ICON_URL = '';
}

if (!process.env.MODULES) {
    process.env.MODULES = '';
}

if (!process.env.MODULES_PATH) {
    process.env.MODULES_PATH = '.';
}
