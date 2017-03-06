import Sequelize from 'sequelize'
import db from '../config/db'

import User from './user'

export const STATE = {
    READY: 'ready',
    DONE: 'done',
    CANCELED: 'canceled',
    PASSED: 'passed'
}

/*
export const TYPE = {
    ONE_SHOT: 'one-shot',
    OCCURRENCE: 'occurrence'
}*/

const Event = db.define('event', {
    name: { type: Sequelize.STRING },
    context: { type: Sequelize.STRING },
    state: {
        type: Sequelize.ENUM(STATE.READY, STATE.DONE, STATE.CANCELED, STATE.PASSED),
        defaultValue: STATE.READY
    }/*,
    ready: {
        type: new Sequelize.VIRTUAL(Sequelize.BOOLEAN, [ 'state' ]),
        get: function () {
            return this.get('state') === STATE.READY
        }
    }*/
}, {
    defaultScope: {
        where: {
            state: STATE.READY
        }
    },
    getterMethods: {
        ready: function () {
            return this.get('state') === STATE.READY
        }
    }
})

Event.belongsTo(User)

Event
.sync({ force: false })

Event.Instance.prototype.finish = function () {
    return this.update({
        state: STATE.DONE
    })
}

Event.Instance.prototype.pass = function () {
    return this.update({
        state: STATE.PASSED
    })
}

Event.Instance.prototype.toChat = function () {
    let s = ''
    s += `\tid: ${this.id}\n`
    s += `\tname: ${this.name}\n`
    s += `\tcontext: ${this.context}\n`
    return s
}

export default Event
