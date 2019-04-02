export const SET_TOKEN = 'SET_TOKEN'
export const setToken = token => ({
  type: SET_TOKEN,
  payload: {
    token,
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
