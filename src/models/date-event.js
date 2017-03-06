import Sequelize from 'sequelize'
import db from '../config/db'

import Event from './event'

const DateEvent = db.define('dateevent', {
    date: { type: Sequelize.DATE },
    // active: {
    //     type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, [ 'date' ]),
    //     get: function () {
    //         return this.get('date') > Date.now()
    //     }
    // },
    /*delay: {
        type: new Sequelize.VIRTUAL(Sequelize.INTEGER, [ 'date' ]),
        get: function () {
            return this.get('date') - Date.now()
        }
    }*/
}, {
    getterMethods: {
        delay: function () {
            return this.get('date') - Date.now()
        },
    }
})

DateEvent.belongsTo(Event)

DateEvent
.sync({ force: false })

export default DateEvent
