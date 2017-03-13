import Sequelize from 'sequelize'
import db from '../config/db'

import User from './user'

let SafeEmail = db.define('safeemail', {
    email: { type: Sequelize.STRING, unique: true }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
})

SafeEmail.belongsTo(User, { foreignKey: 'userId' })

SafeEmail
.sync({ force: false })

SafeEmail.Instance.prototype.toChat = function () {
    let s = ''
    s += `\temail: ${this.email}\n`
    return s
}

export default SafeEmail
