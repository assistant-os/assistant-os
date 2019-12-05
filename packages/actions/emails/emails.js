import { Action, Message } from '@assistant-os/common'

import * as Emails from './emails.service'
import { checkEmails, groupByUser, fixHacks } from './utils'

const INTERVAL = 1000 * 60 * 60 * 24
const READY_TO_WATCH = 'ready-to-watch'
const READY_TO_UNWATCH = 'ready-to-unwatch'

const action = new Action('emails')

let periodicCheck = null

const stopPeriodicCheck = () => {
  clearInterval(periodicCheck)
  periodicCheck = null
}

const startPeriodicCheck = () => {
  if (periodicCheck) {
    stopPeriodicCheck()
  }
  periodicCheck = setInterval(() => {
    const emails = Emails.getAll()
    checkEmails(emails).then(emailsWithUpdatedHacks => {
      const newHacks = (email, index) =>
        email.hacks.length !== emails[index].hacks.length ||
        email.hacks.some(hack => !hack.fixed)

      emailsWithUpdatedHacks
        .filter(newHacks)
        .map(newHackedEmail => {
          Emails.update(newHackedEmail)
          return newHackedEmail
        })
        .reduce(groupByUser, [])
        .forEach(({ list, userId }) => {
          const emails = list.map(({ email }) => `"${email}"`).join(', ')
          const text = `Sorry to bother you but it seems that your emails ${emails} have been hacked. Use valid <email> when you have changed the password.`
          action.sendMessage({ text: Message.fix(text) }, { userId })
        })
    })
  }, INTERVAL)
}

action.onStart = () => {
  Emails.initializeTable()
  startPeriodicCheck()
}

action.onStop = () => {
  stopPeriodicCheck()
}

action
  .when(Message.isCloseToWord('yes'))
  .if(READY_TO_WATCH)
  .then(({ context, userId }) => {
    context.sendTextMessage('ok I remember it')
    Emails.add(context.get('email'), userId)
    context.setDefaultStatus()
  })

action
  .when(Message.isCloseToWord('no'))
  .if(READY_TO_WATCH)
  .then(({ context }) => {
    context.sendTextMessage('ok as you want')
    context.setDefaultStatus()
  })

action
  .when(Message.isCloseToWord('yes'))
  .if(READY_TO_UNWATCH)
  .then(({ context, userId }) => {
    context.sendTextMessage('ok I forget it')
    Emails.remove(context.get('email'), userId)
    context.setDefaultStatus()
  })

action
  .when(Message.isCloseToWord('no'))
  .if(READY_TO_UNWATCH)
  .then(({ context }) => {
    context.sendTextMessage('ok as you want')
    context.setDefaultStatus()
  })

action.when('{email:email}').then(({ email, context, userId }) => {
  const found = Emails.get(email, userId)

  if (found) {
    const { hacks } = found
    const messages = ['I am already keeping an eye on this email.']

    if (hacks && hacks.length > 0) {
      messages.push('Be careful, this email has been pawned.')
    } else {
      messages.push('It is safe for now.')
    }

    messages.push('Do you want me to forget it?')

    context.sendTextMessage(...messages)
    context.setStatus(READY_TO_UNWATCH, { email })
  } else {
    context.sendTextMessage(
      'do you want me to keep an eye on this email?',
      'I will notify you if it appears in hacked databases.'
    )
    context.setStatus(READY_TO_WATCH, { email })
  }
})

action
  .add('valid-email')
  .when('valid {email:email}')
  .then(({ email, context, userId }) => {
    const found = Emails.get(email, userId)
    if (found) {
      Emails.update({
        ...found,
        hacks: fixHacks(found.hacks),
      })
      context.sendTextMessage(`Ok. Roger that!`)
    } else {
      context.sendTextMessage(`sorry but I don't keep an eye of this email`)
    }
    context.setDefaultStatus()
  })

export default action
