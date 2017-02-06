const Sequelize = require('sequelize');
const db = require('../config/db');

const User = require('./user');

const Reminder = db.define('reminder', {
    type: { type: Sequelize.STRING },
    subtype: { type: Sequelize.STRING },
    content: { type: Sequelize.STRING },
    date: { type: Sequelize.STRING },
    finished: { type: Sequelize.STRING, defaultValue: 'false'}
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

Reminder.belongsTo(User);

Reminder
.sync({force: false});

module.exports = Reminder;
