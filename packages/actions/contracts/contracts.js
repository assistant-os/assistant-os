import { Action, Cache, Message } from '@assistant-os/common'

import {
  getCompaniesByName,
  getCompanyDetails,
  displayCompany,
} from './companies'

const READY_TO_ADD_INVOICE = 'ready-to-add-invoice'

const findCompanies = (text, userId, message) =>
  cache.has(message)
    ? cache.get(message)
    : getCompaniesByName(text)
        .then(companies => companies[0])
        .catch(() => 0)

const action = new Action('hello')

const cache = new Cache()

action.when('contracts').then(({ context }) => {
  context.sendTextMessage('Contracts', { straight: true })
})

action
  .when(Message.isCloseToWord('yes'))
  .if(READY_TO_ADD_INVOICE)
  .then(({ context }) => {
    context.sendTextMessage(`Ok I do it`)
    context.setDefaultStatus()
  })

action
  .when(Message.isCloseToWord('no'))
  .if(READY_TO_ADD_INVOICE)
  .then(({ context }) => {
    context.sendTextMessage(`Ok I cancel it`)
    context.setDefaultStatus()
  })

// action
//   .when('add invoice {word:companyName}')
//   .then(({ context, companyName }) => {
//     const { company: companyWithoutDetails } = this.cache.get(message)
//     getCompanyDetails(companyWithoutDetails).then(company => {
//       const link = Message.link(company.name, company.link)
//       context.sendTextMessage(`Do I create a new invoice for ${link}?`)
//       context.setStatus(READY_TO_ADD_INVOICE, { company })
//     })
//   })

action
  .when(findCompanies, found => (found ? found.results.probability * 0.8 : 0))
  .then(({ context, company }) => {
    getCompanyDetails(company).then(fullCompany => {
      const text = Message.link(displayCompany(fullCompany), fullCompany.link)
      context.sendTextMessage(text)
    })
  })

export default action
