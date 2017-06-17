import request from 'request'

// https://haveibeenpwned.com/

const requestFormatted = request.defaults({
    headers: { 'User-Agent': 'Pwnage-Checker-For-Assistant-OS' }
})

export function checkEmail (email) {
  return new Promise((resolve, reject) => {
    const uri = `https://haveibeenpwned.com/api/v2/breachedaccount/${email.email}`
    requestFormatted(uri, (error, response, body) => {
      if (error) {
        resolve({
          success: false,
          reason: 'unknown',
          error: response,
          email,
        })
      } else if (response.statusCode === 404) {
        resolve({
          success: true,
          hacks: [],
          email,
        })
      } else if (response.statusCode === 200) {
        resolve({
          success: true,
          hacks: JSON.parse(response.body),
          email,
        })
      } else if (response.statusCode === 429) {
        resolve({
          success: false,
          reason: 'overloaded',
          email,
        })
      } else {
        resolve({
          success: false,
          reason: 'unknown',
          error: response,
          email,
        })
      }
    })
  })
}

export function checkEmails (emails, callback = null, index = 0) {
  if (index >= emails.length) {
    setTimeout(() => {
      callback && callback(true, null)
    }, 2000)
  } else {
    setTimeout(() => {
      checkEmail(emails[index]).then((response) => {
        callback && callback(false, response)
        checkEmails(emails, callback, index + 1)
      }).catch((e) => {

      })
    }, 2000)
  }
}

export default checkEmail
