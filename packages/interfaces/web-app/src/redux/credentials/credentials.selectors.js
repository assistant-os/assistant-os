export const uri = 'credentials'

export const getToken = state => state[uri].token
export const getHost = state => state[uri].host
export const getSecret = state => state[uri].secret

export const isOnline = state => state[uri].online
export const isStarted = state => state[uri].started

export const isAuthenticated = state => state[uri].isAuthenticated
