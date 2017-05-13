import winston from 'winston'
import request from 'request'
import later from 'later'

// https://haveibeenpwned.com/

import Middleware from '../os/middleware'
import User from '../models/user'
import SafeEmail from '../models/safe-email'
import { default as Hack, STATE as HackState } from '../models/hack'

later.date.localTime()

let safeKeeper = new Middleware({
    description: 'prevent account hackings'
})

let requestFormatted = request.defaults({
    headers: { 'User-Agent': 'Pwnage-Checker-For-Assistant-OS' }
})

function checkEmail (safeEmail, silent = true, callback) {
    // console.log('checkEmail ', safeEmail.email)
    let uri = `https://haveibeenpwned.com/api/v2/breachedaccount/${safeEmail.email}`
    winston.info('check email', { email: safeEmail.email, silent: silent, uri: uri })
    requestFormatted(uri, function (error, response, body) {
        if (error) {
            winston.error('hack.error', { error:error, email: safeEmail.email })
        } else {
            if (response.statusCode === 404) {
                if (!silent) {
                    safeKeeper.emit('hack.no', safeEmail)
                }
            } else if (response.statusCode === 200) {
                for (let hackFound of JSON.parse(response.body)) {
                    // console.log(hackFound)
                    Hack.findOrCreate({
                        where: {
                            name: hackFound.Title,
                            date: new Date(hackFound.BreachDate),
                            safeEmailId: safeEmail.id
                        },
                        defaults: {
                            domain: hackFound.Domain,
                            description: hackFound.Description
                        }
                    }).spread((hack, created) => {
                        hack.safeEmail = safeEmail
                        if (created) {
                            // console.log(safeEmail.id, hack.safeEmailId, hack.safeEmail)
                            safeKeeper.emit('hack.detected', hack)
                        } else if (!hack.managed) {
                            safeKeeper.emit('hack.alive', hack)
                        }
                    })
                }
            } else if (response.statusCode === 429) {
                safeKeeper.emit('hack.overload', safeEmail)
            } else {
                winston.error('hack.unknown', { response: response.statusCode, email: safeEmail.email })
            }

            callback && callback()
        }
    })
}

function checkEmails (emails, index, silent, callback) {
    if (index >= emails.length) {
        callback && callback()
    } else {
        checkEmail(emails[index], silent, () => {
            setTimeout(() => {
                checkEmails(emails, index + 1, silent, callback)
            }, 2000)
        })
    }
}

// safeKeeper.hear([ 'safekeeper add email {{email:email}}', 'add email {{email:email}} to keep safe' ], (req, res) => {
//     // checkEmail('tf@elqui.fr')
//     res.reply(`Ok I will keep your email ${req.parsed.email} safe.`)
// })

safeKeeper.hear([
    'notify me if my email {{email:email}} is compromised',
], (req, res) => {
    SafeEmail.create({
        email: req.parsed.email
    }).then((email) => {
        if (email) {
            email.setUser(req.user)
            email.save().then(() => {
                SafeEmail.findOne({
                    where: {
                        id: email.id
                    },
                    include: [ User ]
                }).then((email) => {
                    res.reply(`Ok I will monitor your email ${req.parsed.email}.`)
                })
            })
        }
    })
})

safeKeeper.hear([
    'stop notifying me if my email {{email:email}} is compromised'
], (req, res) => {
    SafeEmail.destroy({
        where: {
            email: req.parsed.email,
            userId: req.user.id
        },
        truncate: true
    }).then((affectedRows) => {
        if (affectedRows > 0) {
            res.reply(`Ok I won't monitor your email ${req.parsed.email} anymore.`)
        } else {
            res.reply(`Sorry I didn't find your email ${req.parsed.email}.`)
        }
    })
})

safeKeeper.hear([
    'list emails monitored',
    'list my emails monitored'
], (req, res) => {
    SafeEmail.findAll({
        attributes: [ 'id', 'email' ],
        where: {
            userId: req.user.id
        }
    }).then((emails) => {
        // console.log(reminders
        let s = ''
        for (let email of emails) {
            s += email.toChat()
        }

        if (s === '') {
            res.reply('no email found')
        } else {
            res.reply(`emails: \n ${s}`)
        }

    })
})

safeKeeper.hear([
    'check if my emails are compromised',
    'check if my accounts are compromised'
], (req, res) => {
    SafeEmail.findAll({
        attributes: [ 'id', 'email' ],
        where: {
            userId: req.user.id
        },
        include: [ User ]
    }).then((emails) => {
        checkEmails(emails, 0, false, () => {
            res.reply('That\'s finished')
        })
        // let tentatives = []
        //
        // for (let email of emails) {
        //     tentatives.push(
        // }
        //
        // Promise.each(emails, (email) => {
        //
        // }).then(() => {
        //
        // })
    })
})

safeKeeper.hear([
    'list all breaches',
    'list all hackings'
], (req, res) => {
    Hack.findAll({
        include: [ {
            model: SafeEmail,
            as: 'safeEmail',
            include: [ {
                model: User,
                where: {
                    id: req.user.id
                }
            } ]
        } ]
    }).then((hacks) => {
        let s = ''
        for (let hack of hacks) {
            // console.log(hack.safeEmail)
            s += hack.toChat()
        }

        if (s === '') {
            res.reply('no breach found')
        } else {
            res.reply(`breaches: \n ${s}`)
        }
    })
})

safeKeeper.hear([
    'list unmanaged breaches',
    'list unmanaged hackings',
], (req, res) => {
    Hack.findAll({
        where: {
            state: HackState.UNMANAGED
        },
        include: [ {
            model: SafeEmail,
            as: 'safeEmail',
            include: [ {
                model: User,
                where: {
                    id: req.user.id
                }
            } ]
        } ]
    }).then((hacks) => {
        let s = ''
        for (let hack of hacks) {
            // console.log(hack.safeEmail)
            s += hack.toChat()
        }

        if (s === '') {
            res.reply('no unmanaged breach found')
        } else {
            res.reply(`unmanaged breaches: \n ${s}`)
        }
    })
})

safeKeeper.hear('breach at {{url:url}} for email {{email:email}} is managed', (req, res) => {
    Hack.update({
        state: HackState.MANAGED
    }, {
        where: {
             state: HackState.UNMANAGED,
            domain: req.parsed.url
        },
        include: [
            {
                model: SafeEmail,
                as: 'safeEmail',
                where: {
                    email: req.parsed.email,
                    userId: req.user.id
                }
            }
        ]
    }).spread((affectedCount) => {
        if (affectedCount > 0) {
            res.reply(`Ok I got it.`)
        } else {
            res.reply(`Sorry I didn't find the breach you talk about. Maybe it was already managed?`)
        }
    })
})

safeKeeper.on('hack.detected', (hack) => {
    safeKeeper.speak(hack.safeEmail.user, `I have detected a new data breach for email ${hack.safeEmail.email}. It comes from website ${hack.domain} and the breach has been detected the ${hack.date}.`)
})

safeKeeper.on('hack.alive', (hack) => {
    safeKeeper.speak(hack.safeEmail.user, `It seems you never managed data breach about email ${hack.safeEmail.email}. It comes from website ${hack.domain} and the breach has been detected the ${hack.date}.`)
})

safeKeeper.on('hack.overload', (safeEmail) => {
    safeKeeper.speak(safeEmail.user, `Sorry I cannot get response for email ${safeEmail.email}. The last check is too recent`)
})

safeKeeper.on('hack.no', (safeEmail) => {
    safeKeeper.speak(safeEmail.user, `The email ${safeEmail.email} is safe.`)
})


safeKeeper.hear([ 'how to prevent account hackings' ], (req, res) => {
    res.reply('I can keep your online existence safe by checking if your accounts have been compromised.')
    res.reply('Give me your email and I will check periodically if it not appears in recent data breaches like yahoo or linkedin hacks')
    res.reply('*Be careful! I checked only mass data breaches and not individual account hacks.*')
    res.reply('Add an email with order `notify me if my email <email> is compromised`.')
    res.reply('I will notify you if a data breach concerns online accounts using this email.')
    res.reply('For more help, please use `help me to prevent account hackings`')
})

safeKeeper.hear([ 'help me to prevent account hackings' ], (req, res) => {
    res.reply([
        '`how to prevent account hackings`: show description',
        '`notify me if my email <email> is compromised`: add email to monitor',
        '`stop notifying me if my email <email> is compromised`: remove email to monitor',
        '`list my emails monitored`: get the state of my emails',
        '`check if my emails are compromised`: instanstly check if emails have been compromised',
        '`list all breaches`: list all data breaches (managed and unmanaged) about your emails',
        '`list unmanaged breaches`: list all unmanaged breaches about your emails',
        '`breach at <url> for email <email> is managed`: indicate you have managed a breach of one of your account. The easy way to manage a breach is to change the password of the account linked with your email.'
    ])
})

later.setInterval(() => {
    SafeEmail.findAll({
        attributes: [ 'id', 'email' ],
        include: [ User ]
    }).then((emails) => {
        checkEmails(emails, 0, true, () => {
            // safeKeeper.send(emails('That\'s finished')
        })
    })
}, later.parse.text('at 8:24pm'))


export default safeKeeper
