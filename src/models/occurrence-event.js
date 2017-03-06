import Sequelize from 'sequelize'
import db from '../config/db'

import Event from './event'

const OccurrenceEvent = db.define('occureenceevent', {
    occurrence: { type: Sequelize.STRING },
}, {
    // getterMethods: {
    //     delay: function () {
    //         return this.get('date') - Date.now()
    //     },
    // }
})

OccurrenceEvent.belongsTo(Event)

OccurrenceEvent
.sync({ force: false })

export default OccurrenceEvent
