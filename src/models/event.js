import Sequelize from 'sequelize'
import db from '../config/db'

import User from './user'

export const STATE = {
    READY: 'ready',
    DONE: 'done',
    CANCELED: 'canceled',
    PASSED: 'passed'
}

export const TYPE = {
    ONE_SHOT: 'one-shot',
    OCCURRENCE: 'occurrence'
}

const Event = db.define('event', {
    type: { type: Sequelize.ENUM(TYPE.ONE_SHOT, TYPE.OCCURRENCE) },
    name: { type: Sequelize.STRING },
    context: { type: Sequelize.STRING },
    date: { type: Sequelize.STRING },
    state: { type: Sequelize.ENUM(STATE.READY, STATE.DONE, STATE.CANCELED, STATE.PASSED), defaultValue: STATE.READY }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
})

Event.belongsTo(User)

Event
.sync({ force: false })

Event.Instance.prototype.finish = function () {
    return this.update({
        state: STATE.DONE
    })
}

export default Event
