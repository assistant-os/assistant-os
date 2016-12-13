const Sequelize = require('sequelize');

module.exports = function (sequelize) {

    var User = sequelize.define('user', {
        real_name: Sequelize.STRING,
        name: Sequelize.STRING
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    User
    .sync({force: true});

    return User;
};
