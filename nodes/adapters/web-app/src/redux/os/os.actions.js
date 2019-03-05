import io from 'socket.io-client'

import { setOnline } from 'redux/credentials'

import { addMessage } from 'redux/discussion'

let socket = null

let waitForResponse = null

export const emit = (type, token, payload) =>
  socket && socket.emit('message', { type, token, payload })

export const init = (uri, token) => dispatch => {
  console.log('init')
  if (socket) {
    socket.disconnect()
  }

  socket = io(uri)

  socket.on('connect', () => {
    emit('register', token, {
      label: 'Web App',
      priority: 3,
      type: 'adapter',
    })

    waitForResponse = setTimeout(() => {
      dispatch(addMessage('other', 'Connection impossible', 'text'))
      clearTimeout(waitForResponse)
    }, 5000)
  })

  socket.on('disconnect', () => {
    console.log('disconnection')
    dispatch(addMessage('other', 'Disconnection', 'text'))
    dispatch(setOnline(false))
  })

  socket.on('message', ({ type, payload }) => {
    if (type === 'registered') {
      clearTimeout(waitForResponse)
      dispatch(setOnline(true))
      dispatch(addMessage('other', 'Connection established', 'text'))
    }
  })
}

this.context = { type: 'confirmClear' }

export const sendMessage = (token, { type, content }) => dispatch => {

  if (type === 'text' && content.toLowerCase() === 'clear') {
    dispatch(addMessage('other', 'Do you really want to clear my memory?', 'text')
  }
}
