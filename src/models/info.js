const Sequelize = require('sequelize')
const db = require('../config/db')

const User = require('./user')

const Info = db.define('info', {
    description: Sequelize.STRING,
    value: Sequelize.STRING
}, {
    freezeTableName: true // Model tableName will be the same as the model name
})

Info
.sync({ force: false })

Info.belongsTo(User)

module.exports = Info
