import io from 'socket.io-client'

const TIMEOUT = 5000

let socket = null
let credentials = null

let savedCallback = null

export const getSocket = () => socket

export const connect = (token, secret, uri = 'http://localhost:3004') =>
  new Promise((resolve, reject) => {
    socket = io(uri)

    credentials = { token, secret }

    socket.emit('start', credentials)

    const waitForStarted = setTimeout(() => {
      reject()
      socket.disconnect()
    }, TIMEOUT)

    socket.on('started', () => {
      clearInterval(waitForStarted)

      if (savedCallback) {
        onMessage(savedCallback)
      }

      resolve()
    })
  })

export const disconnect = () => {
  if (socket) {
    socket.disconnect()
  }
}

export const send = message => {
  if (socket) {
    socket.emit('message', { ...credentials, ...message })
  }
}

export const onMessage = callback => {
  if (socket) {
    socket.on('message', callback)
  } else {
    savedCallback = callback
  }
}
