const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('user', {
        slackId: {type: Sequelize.STRING, unique: true },
        name: Sequelize.STRING,
        real_name: Sequelize.STRING,
        email: { type: Sequelize.STRING, unique: true },
        state: { type: Sequelize.STRING, defaultValue: 'open' }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
};
