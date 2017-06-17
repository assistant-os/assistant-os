import Sequelize from 'sequelize'
import db from '../../config/db'

import { Email } from '../user'

export const STATE = {
    MANAGED: 'managed',
    UNMANAGED: 'unmanaged'
}

let Hack = db.define('hack', {
    name: { type: Sequelize.STRING },
    domain: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    date: { type: Sequelize.DATE },
    state: {
        type: Sequelize.ENUM(STATE.MANAGED, STATE.UNMANAGED),
        defaultValue: STATE.UNMANAGED
    }
}, {
    getterMethods: {
        managed: function () {
            return this.get('state') === STATE.MANAGED
        }
    }
})

Hack.belongsTo(Email, { as: 'email', foreignKey: 'emailId' })

Hack
.sync({ force: false })

Hack.Instance.prototype.toChat = function () {

    let newDescription = this.description.replace(/\<a href\=\"(.*?)\" target="_blank" rel="noopener"\>(.*?)\<\/a\>/g, function (match, p1, p2) {
        return `<${p1}|${p2}>`
    })
    let s = ''
    s += `\tname: ${this.name}\n`
    s += `\t\temail concerned: ${this.email.email}\n`
    s += `\t\tdomain: ${this.domain}\n`
    s += `\t\tdescription: ${newDescription}\n`
    s += `\t\tdate: ${this.date}\n`
    s += `\t\tstatus: ${this.state}\n`
    return s
}


export default Hack
