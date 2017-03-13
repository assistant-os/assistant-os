import winston from 'winston'
import request from 'request'
import later from 'later'

// https://haveibeenpwned.com/

import Middleware from '../os/middleware'
import User from '../models/user'
import SafeEmail from '../models/safe-email'
import { default as Hack, STATE as HackState } from '../models/hack'

later.date.localTime()

let safeKeeper = new Middleware()

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
    'safekeeper add email {{email:email}}',
    'notify me if my email {{email:email}} has been hacked'
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
                    res.reply(`Ok I will watch your email ${req.parsed.email}.`)
                })
            })
        }
    })
})

safeKeeper.hear([
    'safekeeper remove email {{email:email}}',
    'stop notifying me if my email {{email:email}} has been hacked'
], (req, res) => {
    SafeEmail.destroy({
        where: {
            email: req.parsed.email,
            userId: req.user.id
        },
        truncate: true
    }).then((affectedRows) => {
        if (affectedRows > 0) {
            res.reply(`Ok I won't keep your ${req.parsed.email} safe.`)
        } else {
            res.reply(`Sorry I didn't find your email ${req.parsed.email}.`)
        }
    })
})

safeKeeper.hear([
    'safekeeper list email',
    'list email checked against hacking'
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
    'safekeeper check email',
    'check if my emails have been hacked'
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

safeKeeper.hear('list all hacks', (req, res) => {
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
            res.reply('no hack found')
        } else {
            res.reply(`hacks: \n ${s}`)
        }
    })
})

safeKeeper.hear('list unmanaged hacks', (req, res) => {
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
            res.reply('no unmanaged hack found')
        } else {
            res.reply(`unmanaged hacks: \n ${s}`)
        }
    })
})

safeKeeper.hear('{{url:url}} hack with email {{email:email}} is managed', (req, res) => {
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
            res.reply(`Sorry I didn't find the hack you talk about. Maybe it was already managed?`)
        }
    })
})

safeKeeper.on('hack.detected', (hack) => {
    safeKeeper.speak(hack.safeEmail.user, `I have detected a new hack for email ${hack.safeEmail.email}. It comes from website ${hack.domain} and the breach has been detected the ${hack.date}.`)
})

safeKeeper.on('hack.alive', (hack) => {
    safeKeeper.speak(hack.safeEmail.user, `It seems you never managed hack about email ${hack.safeEmail.email}. It comes from website ${hack.domain} and the breach has been detected the ${hack.date}.`)
})

safeKeeper.on('hack.overload', (safeEmail) => {
    safeKeeper.speak(safeEmail.user, `Sorry I cannot get response for email ${safeEmail.email}. The last check is too recent`)
})

safeKeeper.on('hack.no', (safeEmail) => {
    safeKeeper.speak(safeEmail.user, `The email ${safeEmail.email} is safe.`)
})


safeKeeper.hear([ 'safekeeper help', 'how to keep me safe' ], (req, res) => {
    res.reply([
        'I can keep your online existence safe by checking if your accounts have been hacked.',
        '*Be careful! I checked only mass hacks.*',
        'Add an email I will check periodically with `safekeeper add email <email>` or `notify me if my email <email> is hacked`.',
        'I will notifiy you if a mass hacking concerns your account.',
        'For more help, please use `safekeeper help more`'
    ])
})

safeKeeper.hear([ 'safekeeper help more' ], (req, res) => {
    res.reply([
        '`safekeeper help` | `how to keep me safe`: show description',
        '`safekeeper add email <email>` | `notify me if my email <email> has been hacked`: add email to protect',
        '`safekeeper remove email <email>` | `stop notifying me if my email <email> has been hacked`: remove email to protect',
        '`safekeeper list email` | `list my emails checked against hacking`: get the state of my emails',
        '`safekeeper check email` | `check if my emails have been hacked`: instanstly check if emails have been hacked',
        '`list all hacks`: list all hacks (managed and unmanaged) about your emails',
        '`list unmanaged hacks`: list all unmanaged hacks about your emails',
        '`<url> hack with email <email> is managed`: indicate you have managed a hack of one of your account'
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
