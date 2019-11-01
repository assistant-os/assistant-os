import { Module } from '@assistant-os/utils'
import * as Message from '@assistant-os/utils/message'

import * as emails from './emails.service'

emails.initializeTable()

const isEmail = email => {
  const regex = /^(([^<>()[].,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/gim

  if (regex.test(email)) {
    return email
  }

  // slack transform an email into an mailto link automatically when there is en email
  const isEmailLink = email.match(/^<mailto:(.*)\|.*>$/)
  if (isEmailLink) {
    return isEmailLink[1]
  }

  return null
}

export default class Emails extends Module {
  static READY_TO_WATCH = 'ready-to-watch'
  static OPEN = 'open'
  constructor() {
    super('emails')
  }

  start() {}
  stop() {}

  evaluateProbability(message, userId) {
    if (isEmail(message.text)) {
      return Promise.resolve(1)
    }

    if (
      this.hasStatus(userId, Emails.READY_TO_WATCH) &&
      Message.equals(message, ['yes', 'no'])
    ) {
      return Promise.resolve(1)
    }

    return Promise.resolve(0)
  }

  respond(message, userId) {
    if (this.hasStatus(userId, Emails.READY_TO_WATCH)) {
      if (Message.equals(message, 'yes')) {
        this.emit('message', {
          text: `Ok I remember it`,
          previousMessage: message.id,
        })
        emails.add(this.context[userId].email, userId)
        this.context[userId].status = Emails.OPEN
      } else if (Message.equals(message, 'no')) {
        this.emit('message', {
          text: `Ok as you want`,
          previousMessage: message.id,
        })
        this.context[userId].status = Emails.OPEN
      }

      return
    }

    const email = isEmail(message.text)

    if (emails.has(email, userId)) {
      this.emit('message', {
        text: `I already watched this email. Do you want me to unwatch it?`,
        previousMessage: message.id,
      })
    } else {
      this.emit('message', {
        text: `Do you want me to watch this email?`,
        previousMessage: message.id,
      })
      this.context[userId] = {
        status: Emails.READY_TO_WATCH,
        email,
      }
    }
  }
}
