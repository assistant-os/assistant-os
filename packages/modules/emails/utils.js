import request from 'request'

import { logger } from '@assistant-os/utils'

export const extractEmail = email => {
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

export const isEmail = (...args) => Boolean(extractEmail(...args))

// https://haveibeenpwned.com/

const requestFormatted = request.defaults({
  headers: {
    'User-Agent': 'Pwnage-Checker-For-Assistant-OS',
    'hibp-api-key': '49583c979d044e30a63a0d6333630ca3',
  },
})

export const checkEmail = ({ email, hacks = [], ...rest }) =>
  new Promise((resolve, reject) => {
    const uri = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`
    requestFormatted(uri, (error, response) => {
      if (error) {
        reject({
          success: false,
          reason: 'unknown',
          error: response,
        })
      } else if (response.statusCode === 404) {
        resolve({
          ...rest,
          email,
          hacks: [],
        })
      } else if (response.statusCode === 200) {
        const newHacks = JSON.parse(response.body)
        resolve({
          ...rest,
          email,
          hacks: newHacks.map(i => ({
            fixed: true,
            name: i.Name,
            ...hacks.find(hack => hack.name === i.Name),
            updatedAt: new Date(),
          })),
        })
      } else if (response.statusCode === 429) {
        reject({
          success: false,
          reason: 'overloaded',
          email,
        })
      } else {
        reject({
          success: false,
          reason: 'unknown',
          error: response,
          email,
        })
      }
    })
  })

const SAFE_DELAY_BETWEEN_REQUESTS = 2000

export const checkEmails = emails => {
  return new Promise(resolve => {
    let index = 0
    const results = []
    const interval = setInterval(() => {
      if (index < emails.length) {
        const email = emails[index]
        checkEmail(email)
          .then(hacks => {
            results.push(hacks)
          })
          .catch(error => {
            logger.error(`error while checking email`, { error })
          })
        index += 1
      } else {
        clearInterval(interval)
        resolve(results)
      }
    }, SAFE_DELAY_BETWEEN_REQUESTS)
  })
}

export const groupByUser = (acc, { email, hacks, userId }) => {
  const result = [...acc]
  const index = acc.findIndex(i => i.userId === userId)
  if (index >= 0) {
    result[index] = {
      userId,
      list: [...acc[index].list, { email, hacks }],
    }
  } else {
    result.push({
      userId,
      list: [{ email, hacks }],
    })
  }

  return result
}

export const fixHacks = (hacks, fixed = true) =>
  hacks.map(hack => ({ ...hack, fixed }))
