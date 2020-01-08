import io from 'socket.io-client'

import {
  setOnline,
  clearCredentials,
  getHost,
  getToken,
  setHost,
  setToken,
  isOnline,
  setStarted,
} from 'redux/credentials'

import { addMessage, clearMessages } from 'redux/discussion'

let socket = null

let waitForResponse = null

let context = null

let identity = { name: 'Assistant OS' }

const matchExact = (format, content, pattern, contextIdRequired) => {
  return (
    format === 'text' &&
    content.toLowerCase() === pattern &&
    (!contextIdRequired || context || context.id === contextIdRequired)
  )
}

const showNotification = message => {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(identity.name, {
      body: message,
    })
  }
}

export const SET_MEMORY = 'SET_MEMORY'
export const setMemory = memory => ({
  type: SET_MEMORY,
  payload: { memory },
})

export const emit = (type, token, payload) =>
  socket && socket.emit('data', { type, token, payload })

export const init = (uri, token) => dispatch => {
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
    // dispatch(addMessage('other', 'Disconnection', 'text'))
    dispatch(setOnline(false))
  })

  socket.on('data', ({ type, payload }) => {
    if (type === 'registered') {
      clearTimeout(waitForResponse)
      dispatch(setOnline(true))
      if (context && context.id === 'try-connection') {
        dispatch(addMessage('other', 'Connection established', 'text'))
      }

      identity.name = payload.name

      // https://developer.mozilla.org/fr/docs/Web/API/notification/Using_Web_Notifications

      const notificationReady =
        window.Notification && Notification.permission === 'granted'

      Notification.requestPermission(status => {
        if (Notification.permission !== status) {
          Notification.permission = status
        }

        if (!notificationReady) {
          showNotification('Notifications are now authorized.')
        } else {
          showNotification(`${identity.name} ready to help you!`)
        }
      })
    } else if (type === 'answer-answer') {
      dispatch(addMessage('other', payload.content, payload.format))
      dispatch(setMemory(payload.memory))

      // https://www.w3.org/TR/page-visibility/

      if (document.visibilityState === 'hidden' && payload.format === 'text') {
        showNotification(payload.content)
      }
    } else if (type === 'set-data') {
    }
  })
}

export const sendMessage = (format, content) => (dispatch, getState) => {
  const state = getState()

  const token = getToken(state)

  dispatch(addMessage('me', content, format))

  const timeout = 1500
  if (
    matchExact(format, content, 'exit') ||
    matchExact(format, content, 'quit')
  ) {
    dispatch(setStarted(false))
  } else if (matchExact(format, content, 'reset')) {
    setTimeout(() => {
      dispatch(
        addMessage('other', 'Do you really want to clear my memory?', 'text')
      )
      context = { id: 'confirmClear' }
    }, timeout)
  } else if (matchExact(format, content, 'clear')) {
    dispatch(clearMessages())
  } else if (matchExact(format, content, 'yes', 'confirmReset')) {
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
  } else if (matchExact(format, content, 'notification')) {
    showNotification('Hello !')
  } else if (matchExact(format, content, 'no', 'confirmReset')) {
    context = null
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
        'Please provide me the url of a virtual assistant to connect to.',
        'text'
      )
    )
  } else if (!getToken(state)) {
    dispatch(
      addMessage(
        'other',
        'Please provide me the token of the assistant.',
        'text'
      )
    )
  } else {
    dispatch(init(getHost(state), getToken(state)))
  }
}

export const setValue = (id, value) => (dispatch, getState) => {
  emit('set-value', getToken(getState()), { id, value })
  dispatch(setMemory({ [id]: value }))
}
