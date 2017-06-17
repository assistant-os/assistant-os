import Sequelize from 'sequelize'
import db from '../../config/db'

import User from './user'

let Email = db.define('email', {
    email: { type: Sequelize.STRING },
    lastCheck: { type: Sequelize.DATE, nullable: true },
}, {
    freezeTableName: true // Model tableName will be the same as the model name
})

Email.belongsTo(User)
// Email.hasOne(User)

Email.sync({ force: false })

User.sync({ force: false })

Email.Instance.prototype.toChat = function () {
    let s = ''
    s += `\temail: ${this.email}\n`
    return s
}

export default Email
