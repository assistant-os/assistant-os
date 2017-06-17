import db from '../../config/db'

import User from '../user'

const OnlineSecurity = db.define('online-security', {
}, {
  freezeTableName: true,
})

// User.belongsTo(Security)
// User.belongsTo(Security)
// Security.hasOne(User)
//
// User
// .sync({ force: false })

OnlineSecurity.belongsTo(User)
// Security.hasOne(User)

// User.hasOne(Security)
//
// User.belongsTo(Security)
// Security.hasOne(User)

// User
// .sync({ force: false })

OnlineSecurity
.sync({ force: false })




// User
// .sync({ force: false })

export default OnlineSecurity
