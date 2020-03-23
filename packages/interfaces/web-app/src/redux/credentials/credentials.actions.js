import { generateRandom } from 'utils/random'
import { getToken } from './credentials.selectors'

export const SET_TOKEN = 'SET_TOKEN'
export const setToken = token => ({
  type: SET_TOKEN,
  payload: {
    token,
  },
})

export const SET_SECRET = 'SET_SECRET'
export const setSecret = secret => ({
  type: SET_SECRET,
  payload: {
    secret,
  },
})

export const SET_HOST = 'SET_HOST'
export const setHost = host => ({
  type: SET_HOST,
  payload: {
    host,
  },
})

export const CLEAR_CREDENTIALS = 'CLEAR_CREDENTIALS'
export const clearCredentials = () => ({
  type: CLEAR_CREDENTIALS,
})

export const SET_ONLINE = 'SET_ONLINE'
export const setOnline = online => ({
  type: SET_ONLINE,
  payload: {
    online,
  },
})

export const SET_STARTED = 'SET_STARTED'
export const setStarted = started => ({
  type: SET_STARTED,
  payload: {
    started,
  },
})

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED'
const setAuthenticated = isAuthenticated => ({
  type: SET_AUTHENTICATED,
  payload: {
    isAuthenticated,
  },
})

function getURL(href) {
  var match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  )
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  )
}

export const login = link => (dispatch, getState) => {
  const url = getURL(link)

  console.log('url', url)

  dispatch(setHost(link))

  if (!getToken(getState())) {
    dispatch(setToken(generateRandom()))
  }

  dispatch(setAuthenticated(true))
}
