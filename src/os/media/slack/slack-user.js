const Sequelize = require('sequelize');

const db = require('../../config/db');
const User = require('../../models/user');

var SlackUser = db.define('user', {
    slackId: { type: Sequelize.STRING, unique: true },
    name: { type:Sequelize.STRING, unique: true }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

SlackUser.extends(User);

SlackUser
.sync({force: true});

module.exports = SlackUser;
