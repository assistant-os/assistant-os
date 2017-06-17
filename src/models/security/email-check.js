import Sequelize from 'sequelize'
import db from '../../config/db'

import { Email } from '../user'

let EmailCheck = db.define('email-check', {
  state: {
      type: Sequelize.ENUM('alive', 'detected', 'overloaded', 'no'),
      defaultValue: 'no'
  }
}, {
  freezeTableName: true,
})

EmailCheck.belongsTo(Email)

EmailCheck
.sync({ force: false })

export default EmailCheck
