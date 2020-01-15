import {
  clearCredentials,
  getSecret,
  setSecret,
  getHost,
  getToken,
  setHost,
  setToken,
} from 'redux/credentials'
import {
  addAssistantMessage,
  addUserMessage,
  clearMessages,
} from 'redux/messages'
import { connect, onMessage } from 'utils/socket'

import {
  WELCOME,
  WAITING_FOR_TOKEN,
  WAITING_FOR_HOST,
  WAITING_FOR_SECRET,
  READY_FOR_CONNECTION,
  READY_FOR_DISCUSSION,
} from './stages'

import { generateRandom } from 'utils/random'

let nextUserMessageCallback = null
let silent = true

let stage = WELCOME

const onNextUserMessage = callback => {
  nextUserMessageCallback = callback
}

export const handleStage = () => (dispatch, getState) => {
  const say = text => dispatch(addAssistantMessage({ text }))

  const state = getState()
  switch (stage) {
    case WELCOME:
      stage = WAITING_FOR_TOKEN
      return dispatch(handleStage())
    case WAITING_FOR_TOKEN:
      if (getToken(state)) {
        stage = WAITING_FOR_HOST
        return dispatch(handleStage())
      }
      dispatch(setToken(generateRandom()))
      stage = WAITING_FOR_HOST
      return dispatch(handleStage())
    case WAITING_FOR_HOST:
      if (getHost(state)) {
        stage = WAITING_FOR_SECRET
        return dispatch(handleStage())
      }
      say('Please provide me the url of a virtual assistant to connect to.')
      return onNextUserMessage(({ text }) => {
        if (text.match(/http(s|):\/\/[A-Za-z0-9.\-_:/]+/)) {
          dispatch(setHost(text))
          say('Ok thank you.')
          stage = WAITING_FOR_SECRET
        } else {
          say('The url is not valid.')
        }
        dispatch(handleStage())
      })
    case WAITING_FOR_SECRET:
      if (getSecret(state)) {
        stage = READY_FOR_CONNECTION
        return dispatch(handleStage())
      }
      say('Please provide me the secret token of the assistant.')
      return onNextUserMessage(({ text }) => {
        dispatch(setSecret(text))
        say('Ok thank you.')
        silent = false
        stage = READY_FOR_CONNECTION
        dispatch(handleStage())
      })
    case READY_FOR_CONNECTION:
      silent || say('Trying to connect...')
      return connect(
        getToken(state),
        getSecret(state),
        getHost(state)
      )
        .then(() => {
          silent || say('Connection established.')
          console.log('connection established')
          stage = READY_FOR_DISCUSSION
          dispatch(startConversation())
        })
        .catch(() => {
          say('Connection failed.')
        })
    default:
      break
  }
}

const startConversation = () => (dispatch, getState) => {
  onMessage(message => {
    dispatch(addAssistantMessage(message))
  })
}

const context = { previous: '' }

const processCommand = message => (dispatch, getState) => {
  const say = text => dispatch(addAssistantMessage({ text }))

  if (context.previous === 'clear') {
    if (message.text.toLowerCase() === 'yes') {
      dispatch(addUserMessage(message, false))
      dispatch(clearMessages())
      stage = WELCOME
      return true
    } else if (message.text.toLowerCase() === 'no') {
      dispatch(addUserMessage(message, false))
      say('Ok')
      context.previous = ''
      return true
    }
  } else if (context.previous === 'reset') {
    if (message.text.toLowerCase() === 'yes') {
      dispatch(addUserMessage(message, false))
      dispatch(clearCredentials())
      dispatch(clearMessages())
      return true
    } else if (message.text.toLowerCase() === 'no') {
      dispatch(addUserMessage(message, false))
      say('Ok')
      context.previous = ''
      return true
    }
  }
  if (message.text === '/clear') {
    dispatch(addUserMessage(message, false))
    say('Do you really want to clean all messages?')
    context.previous = 'clear'
    return true
  }

  if (
    message.text === '/leave' ||
    message.text === '/quit' ||
    message.text === '/reset'
  ) {
    dispatch(addUserMessage(message, false))
    say('Do you really want to reset everything?')
    context.previous = 'reset'
    return true
  }

  return false
}

export const processUserMessage = message => (dispatch, getState) => {
  if (stage === READY_FOR_DISCUSSION) {
    if (!dispatch(processCommand(message))) {
      dispatch(addUserMessage(message, true))
    }
  } else if (!dispatch(processCommand(message))) {
    dispatch(addUserMessage(message))
    if (nextUserMessageCallback) {
      nextUserMessageCallback(message)
    }
  }
}

export const SET_MEMORY = 'SET_MEMORY'
export const setMemory = memory => ({
  type: SET_MEMORY,
  payload: { memory },
})
