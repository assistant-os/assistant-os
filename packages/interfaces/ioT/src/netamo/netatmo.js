const axios = require('axios')
const qs = require('qs')

let access_token = ''

const baseUrlAuth = 'https://api.netatmo.net'
const baseURL = 'https://api.netatmo.net/api'

const instance = axios.create({
  baseURL,
})

const form = params => qs.stringify(params)

const authenticate = auth =>
  axios
    .post(
      '/oauth2/token',
      form({ grant_type: 'password', scope: 'read_camera', ...auth }),
      {
        baseURL: baseUrlAuth,
      }
    )
    .then(({ data }) => {
      access_token = data.access_token
    })

const getHomeData = () =>
  instance
    .get('/gethomedata', { params: { access_token } })
    .then(({ data }) => {
      return data.body.homes
    })

module.exports = {
  authenticate,
  getHomeData,
}
