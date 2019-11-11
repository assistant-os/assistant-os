import { Module, Cache } from '@assistant-os/utils'
import * as Message from '@assistant-os/utils/message'

import {
  getCompaniesByName,
  getCompanyDetails,
  displayCompany,
} from './companies'

const READY_TO_ADD_INVOICE = 'ready-to-add-invoice'

export default class Contracts extends Module {
  constructor() {
    super('contracts')

    this.cache = new Cache()
  }

  start() {}

  stop() {}

  evaluateProbability(message, userId) {
    return new Promise(resolve => {
      const context = this.getContext(message, userId)

      if (message.text === 'contracts') {
        resolve(1)
        return
      }

      if (
        context.hasStatus(READY_TO_ADD_INVOICE) &&
        (Message.isConfirm(message) || Message.isCancel(message))
      ) {
        resolve(1)
        return
      }

      if (message.text.startsWith('add invoice')) {
        const name = message.text.replace('add invoice', '').trim()
        getCompaniesByName(name)
          .then(companies => {
            const { company, probability } = companies[0]
            this.cache.add(message, { company })
            resolve(probability)
          })
          .catch(() => {
            resolve(0)
          })
      } else {
        getCompaniesByName(message.text)
          .then(companies => {
            const { company, probability } = companies[0]

            this.cache.add(message, { company })
            resolve(probability)
          })
          .catch(() => {
            resolve(0)
          })
      }
    })
  }

  respond(message, userId) {
    const context = this.getContext(message, userId)

    if (message.text === 'contracts') {
      context.sendTextMessage(`Contract`)
      return
    }

    if (context.hasStatus(READY_TO_ADD_INVOICE)) {
      if (Message.isConfirm(message)) {
        context.sendTextMessage(`Ok I do it`)
        context.setDefaultStatus()
      } else if (Message.isCancel(message)) {
        context.sendTextMessage(`Ok I cancel it`)
        context.setDefaultStatus()
      }
      return
    }

    if (message.text.startsWith('add invoice')) {
      const { company: companyWithoutDetails } = this.cache.get(message)
      getCompanyDetails(companyWithoutDetails).then(company => {
        const link = Message.link(company.name, company.link)
        context.sendTextMessage(`Do I create a new invoice for ${link}?`)
        context.setStatus(READY_TO_ADD_INVOICE, { company })
      })
      return
    }

    const { company } = this.cache.get(message)
    if (company) {
      getCompanyDetails(company).then(fullCompany => {
        context.sendTextMessage(
          Message.link(displayCompany(fullCompany), fullCompany.link)
        )
      })
    }
  }
}
