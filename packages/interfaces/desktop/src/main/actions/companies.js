import Company from '../services/company.service'
import logger from '../utils/logger'

export const init = () => Promise.resolve()

const userId = 'userId'

export const getAvailableActions = async query => {
  return [
    {
      type: 'get-company-info',
      id: `get-company-info-${query}`,
      label: query,
      subLabel: 'company info',
      section: 'companies',
      priority: 7,
      icon: 'question',
      detail: 'get-legal-information',
      payload: {
        company: {
          name: query,
        },
      },
    },
  ]
}

export const executionAction = async ({ action, query, close, keep }) => {}

const debounce = (func, wait, immediate = false) => {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export const getData = ({ request, action }) =>
  new Promise((resolve, reject) => {
    if (request.type === 'get-legal-information') {
      Company.getCompanyDetailsByName(action.payload.company.name)
        .then(company => {
          resolve({
            name: company.name,
            address: company.address,
            createdAt: company.createdAt,
            legal: {
              SIREN: company.siren,
              SIRET: company.siret,
            },
            link: company.link,
          })
        })
        .catch(error => {
          logger.error({ error })
          resolve({ no: true })
        })
    } else {
      resolve({ no: true })
    }
  })
