const Sequelize = require('sequelize')
const db = require('../config/db')

const User = require('./user')

const Group = db.define('group', {
    name: Sequelize.STRING
}, {
    freezeTableName: true // Model tableName will be the same as the model name
})

Group
.sync({force: false})

Group
.findOrCreate({ where: { name: 'master' }})

module.exports = Group
