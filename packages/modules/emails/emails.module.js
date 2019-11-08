import { Module } from '@assistant-os/utils'
import * as Message from '@assistant-os/utils/message'

import * as Emails from './emails.service'
import {
  isEmail,
  extractEmail,
  checkEmails,
  groupByUser,
  changeHacksStatus,
} from './utils'

const INTERVAL = 1000 * 60 // * 60 * 24
const READY_TO_WATCH = 'ready-to-watch'
const READY_TO_UNWATCH = 'ready-to-unwatch'

export default class EmailsWatcher extends Module {
  constructor() {
    super('emails')
  }

  start() {
    Emails.initializeTable()
    this.startInterval()
  }

  stop() {}

  startInterval() {
    if (this.interval) {
      this.stopInterval()
    }
    this.interval = setInterval(() => {
      const emails = Emails.getAll()
      checkEmails(emails).then(emailsWithUpdatedHacks => {
        const newHacks = (email, index) =>
          email.hacks.length !== emails[index].hacks.length ||
          email.hacks.some(hack => hack.status)

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
            this.sendMessage(Message.fix({ text }), { userId })
          })
      })
    }, INTERVAL)
  }

  stopInterval() {
    clearInterval(this.interval)
    this.interval = null
  }

  evaluateProbability(message, userId) {
    return new Promise(resolve => {
      const context = this.getContext(message, userId)
      if (isEmail(message.text)) {
        return resolve(1)
      }

      if (
        context.hasStatus(READY_TO_WATCH) &&
        Message.equals(message, ['yes', 'no'])
      ) {
        return resolve(1)
      }

      if (
        context.hasStatus(READY_TO_WATCH) &&
        Message.equals(message, ['yes', 'no'])
      ) {
        return resolve(1)
      }

      if (message.text.toLowerCase().startsWith('valid')) {
        const rest = message.text.toLowerCase().replace('valid ', '')
        if (isEmail(rest)) {
          return resolve(1)
        }
      }

      return resolve(0)
    })
  }

  respond(message, userId) {
    const context = this.getContext(message, userId)
    if (context.hasStatus(READY_TO_WATCH)) {
      if (Message.equals(message, 'yes')) {
        context.sendTextMessage('ok I remember it')
        Emails.add(context.get('email'), userId)
        context.setDefaultStatus()
        return
      } else if (Message.equals(message, 'no')) {
        context.sendTextMessage('ok as you want')
        context.setDefaultStatus()
        return
      }
    }

    if (context.hasStatus(READY_TO_UNWATCH)) {
      if (Message.equals(message, 'yes')) {
        context.sendTextMessage('ok I forget it')
        Emails.remove(context.get('email'), userId)
        context.setDefaultStatus()
        return
      } else if (Message.equals(message, 'no')) {
        context.sendTextMessage('ok as you want')
        context.setDefaultStatus()
        return
      }
    }

    if (message.text.toLowerCase().startsWith('valid')) {
      const rest = message.text.toLowerCase().replace('valid ', '')
      const email = extractEmail(rest)
      if (email) {
        const found = Emails.get(email, userId)
        if (found) {
          Emails.update({
            ...found,
            hacks: changeHacksStatus(found.hacks, false),
          })
          context.sendTextMessage(`Ok. Roger that!`)
          context.setDefaultStatus()
          return
        } else {
          context.sendTextMessage(`sorry but I don't keep an eye of this email`)
          context.setDefaultStatus()
          return
        }
      }
    }

    const email = extractEmail(message.text)
    const found = Emails.get(email, userId)

    if (found) {
      const { email, hacks } = found
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
  }
}
