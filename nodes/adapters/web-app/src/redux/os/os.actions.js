import io from 'socket.io-client'

import {
  setOnline,
  clearCredentials,
  getHost,
  getToken,
  setHost,
  setToken,
  isOnline,
} from 'redux/credentials'

import { addMessage, clearMessages } from 'redux/discussion'

let socket = null

let waitForResponse = null

let context = null

const matchExact = (format, content, pattern, contextIdRequired) => {
  return (
    format === 'text' &&
    content.toLowerCase() === pattern &&
    (!contextIdRequired || (context || context.id === contextIdRequired))
  )
}

export const emit = (type, token, payload) =>
  socket && socket.emit('data', { type, token, payload })

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

  socket.on('data', ({ type, payload }) => {
    if (type === 'registered') {
      clearTimeout(waitForResponse)
      dispatch(setOnline(true))
      dispatch(addMessage('other', 'Connection established', 'text'))
    } else if (type === 'answer-answer') {
      dispatch(addMessage('other', payload.content, payload.format))
    }
  })
}

export const sendMessage = (format, content) => (dispatch, getState) => {
  const state = getState()

  const token = getToken(state)

  dispatch(addMessage('me', content, format))

  const timeout = 1500

  if (matchExact(format, content, 'clear')) {
    setTimeout(() => {
      dispatch(
        addMessage('other', 'Do you really want to clear my memory?', 'text')
      )
      context = { id: 'confirmClear' }
    }, timeout)
  } else if (matchExact(format, content, 'yes', 'confirmClear')) {
    setTimeout(() => {
      dispatch(addMessage('other', 'Ok. Clearing memory.', 'text'))
      setTimeout(() => {
        dispatch(clearMessages())
        dispatch(clearCredentials())
        setTimeout(() => {
          dispatch(tryConnection())
        }, 1000)
      }, 2000)
    }, timeout)
  } else if (!isOnline(state)) {
    setTimeout(() => {
      if (!getHost(state)) {
        if (content.match(/http(s|):\/\/[A-Za-z0-9.\-_:/]+/)) {
          dispatch(setHost(content))
          dispatch(tryConnection())
        } else {
          dispatch(addMessage('other', 'Please provide a valid url.'))
        }
      } else if (!token) {
        if (content.match(/[A-Za-z0-9]+/)) {
          dispatch(setToken(content))
          dispatch(
            addMessage(
              'other',
              'Ok thank you. I try to establish the connection.',
              'text'
            )
          )
          context = { id: 'try-connection' }
          dispatch(tryConnection())
        } else {
          dispatch(addMessage('other', 'Please provide a valid token.'))
        }
      } else {
        dispatch(tryConnection())
      }
    }, timeout)
  } else if (socket) {
    emit('message', token, { content, format })
  }
}

export const tryConnection = () => (dispatch, getState) => {
  const state = getState()
  if (!getHost(state)) {
    dispatch(
      addMessage(
        'other',
        'In order to connect, I need to have the url of your assistant.',
        'text'
      )
    )
  } else if (!getToken(state)) {
    dispatch(
      addMessage(
        'other',
        'I need a token to be authorized by your assistant.',
        'text'
      )
    )
  } else {
    dispatch(init(getHost(state), getToken(state)))
  }
}
