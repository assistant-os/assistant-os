export const uri = 'credentials'

export const getToken = state => state[uri].token
export const getHost = state => state[uri].host
export const isOnline = state => state[uri].online
export const isStarted = state => state[uri].started
