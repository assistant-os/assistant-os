import Sequelize from 'sequelize'
import db from '../config/db'

// const Group = require('./group')

let User = db.define('user', {
    real_name: { type: Sequelize.STRING, unique: false },
    slackId: { type: Sequelize.STRING, unique: true },
    name: { type:Sequelize.STRING, unique: true }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
})

User
.sync({ force: false })

// User.hasMany(Group)

export default User
