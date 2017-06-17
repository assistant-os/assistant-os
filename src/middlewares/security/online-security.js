import later from 'later'


import Middleware from '../../os/middleware'

import { checkEmails } from '../../helpers/have-i-been-pawned'
import { User, Email } from '../../models/user'
import { default as Hack, STATE as HackState } from '../../models/security/hack'
import { EmailCheck, OnlineSecurity } from '../../models/security'

later.date.localTime()

const onlineSecurity = new Middleware({
  id: 'online-protection',
  description: 'protect against account hackings',
})

function addEmailCheck (email, state) {
  EmailCheck.create({
    state: state,
    emailId: email.id,
  })
}

function checkforHacks (emails, silent = true, callback = null) {
  let everythingIsOk = true
  checkEmails(emails, (finished, response) => {
    if (finished) {
      callback && callback(everythingIsOk)
    } else {
      if (response.success) {
        if (response.hacks.length === 0) {
          if (!silent) {
            onlineSecurity.emit('hack.no', response.email)
          }
          addEmailCheck(response.email, 'no')

        } else {
          for (const hack of response.hacks) {
            Hack.findOrCreate({
              where: {
                name: hack.Title,
                date: new Date(hack.BreachDate),
                emailId: response.email.id
              },
              defaults: {
                domain: hack.Domain,
                description: hack.Description
              }
            }).spread((hack, created) => {
              console.log('spread', response.email.email)
              hack.email = response.email
              if (created) {
                // if (!silent) {
                  onlineSecurity.emit('hack.detected', hack)
                  everythingIsOk = false

                // }
                addEmailCheck(response.email, 'detected')

              } else if (!hack.managed) {
                // if (!silent) {
                  onlineSecurity.emit('hack.alive', hack)
                  everythingIsOk = false
                // }
                addEmailCheck(response.email, 'alive')
              } else {
                if (!silent) {
                  onlineSecurity.emit('hack.no', response.email)
                }
                addEmailCheck(response.email, 'no')
              }
            })
          }
        }
      } else if (response.reason === 'overloaded') {
        if (!silent) {
          onlineSecurity.emit('hack.overload', response.email)
        }
        addEmailCheck(response.email, 'overloaded')
      }
    }
  })
}

// safeKeeper.hear([ 'safekeeper add email {{email:email}}', 'add email {{email:email}} to keep safe' ], (req, res) => {
//     // checkEmail('tf@elqui.fr')
//     res.reply(`Ok I will keep your email ${req.parsed.email} safe.`)
// })

onlineSecurity.hear([
  'start online protection',
  'enable online protection',
  'activate online protection',
  'online protection start',
  'online protection enable',
  'online protection activate',
  'start online security',
  'enable online security',
  'activate online security',
  'online security start',
  'online security enable',
  'online security activate',
], (req, res) => {

  OnlineSecurity.findOrCreate({
    where: {
      userId: req.user.id,
    },
  }).spread((monitorUser, created) => {
    res.reply('Ok I will check every evening if your emails have been compromised.')
  })
})

onlineSecurity.hear([
  'stop online protection',
  'disable online protection',
  'desactivate online protection',
  'online protection stop',
  'online protection disable',
  'online protection desactivate',
  'stop online security',
  'disable online security',
  'desactivate online security',
  'online security stop',
  'online security disable',
  'online security desactivate',
], (req, res) => {
  OnlineSecurity.destroy({
    where: {
      userId: req.user.id
    },
    truncate: true
  }).then((affectedRows) => {
    if (affectedRows > 0) {
      res.reply(`Ok online security is now desactivated`)
    } else {
      res.reply(`Sorry but it seems that online security was not activated.`)
    }
  })
})

onlineSecurity.hear([
  'check if my emails are compromised',
  'check if my accounts are compromised'
], (req, res) => {
  Email.findAll({
    attributes: [ 'id', 'email' ],
    where: {
      userId: req.user.id
    },
    include: [ User ]
  }).then((emails) => {
    checkforHacks(emails, false, () => {
      res.reply('That\'s finished')
    })
  })
})

onlineSecurity.hear([
  'list all breaches',
  'list all hackings'
], (req, res) => {
  Hack.findAll({
    include: [ {
      model: Email,
      as: 'email',
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



/*

onlineSecurity.hear([
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
*/

onlineSecurity.hear([
  'list breaches',
  'list hackings',
  'list current breaches',
  'list current hackings',
], (req, res) => {
  Hack.findAll({
    where: {
      state: HackState.UNMANAGED
    },
    include: [ {
      model: Email,
      as: 'email',
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


onlineSecurity.hear('breach at url {{url:url}} for email {{email:email}} is managed', (req, res) => {
  Hack.update({
    state: HackState.MANAGED
  }, {
    where: {
      state: HackState.UNMANAGED,
      domain: req.parsed.url
    },
    include: [
      {
        model: Email,
        as: 'email',
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


onlineSecurity.on('hack.detected', (hack) => {
  onlineSecurity.speak(hack.email.user, `I have detected a new data breach for email ${hack.email.email}. It comes from website ${hack.domain} and the breach has been detected the ${hack.date}.`)
})

onlineSecurity.on('hack.alive', (hack) => {
  onlineSecurity.speak(hack.email.user, `It seems you never managed data breach about email ${hack.email.email}. It comes from website ${hack.domain} and the breach has been detected the ${hack.date}.`)
})

onlineSecurity.on('hack.overload', (email) => {
  console.log('overloaded')
  onlineSecurity.speak(email.user, `Sorry I cannot get response for email ${email.email}. The last check is too recent`)
})

onlineSecurity.on('hack.no', (email) => {
  onlineSecurity.speak(email.user, `The email ${email.email} is safe.`)
})


// onlineSecurity.hear([
//   'online protection help', 'online protection help'
// ], (req, res) => {
//   res.reply('I can keep your online existence safe by checking if your accounts have been compromised.')
//   res.reply('Give me your email and I will check periodically if it not appears in recent data breaches like yahoo or linkedin hacks')
//   res.reply('*Be careful! I checked only mass data breaches and not individual account hacks.*')
//   res.reply('Add an email with order `notify me if my email <email> is compromised`.')
//   res.reply('I will notify you if a data breach concerns online accounts using this email.')
//   res.reply('For more help, please use `help me to prevent account hackings`')
// })

onlineSecurity.hear([
  'online protection help',
  'online security help',
  'help online protection',
  'help online security',

], (req, res) => {
  res.reply([
    '`add email <email>`: add email',
    '`check if my emails are compromised`: force instant check compromission on all emails',
    '`list all breaches`: list all data breaches (managed and unmanaged) about your emails',
    '`list current breaches`: list all breaches about your emails that have not been managed',
    '`breach at url <url> for email <email> is managed`: indicate you have managed a breach of one of your account. The easy way to manage a breach is to change the password of the account linked with your email.'
  ])
})

later.setInterval(() => {
  OnlineSecurity.findAll({
    include: [ User ],
  }).then((securities) => {
    for (const security of securities) {
      // onlineSecurity.speak(security.user, `I begin to check your emails today.`)
      Email.findAll({
        where: {
          userId: security.user.id,
        },
        attributes: [ 'id', 'email' ],
        include: [ User ]
      }).then((emails) => {
        // onlineSecurity.speak(security.user, `There are ${emails.length} emails to check today.`)
        checkforHacks(emails, true, (everythingIsOk) => {
          if (everythingIsOk) {
            onlineSecurity.speak(security.user, `I have just checked your email addresses and everything seems Ok. There are not compromised.`)
          }
        })
      })
    }
  })
}, later.parse.text('at 8:16pm'))

// }, later.parse.text('at 8:24pm'))


export default onlineSecurity
