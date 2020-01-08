import {
  setOnline,
  clearCredentials,
  getSecret,
  setSecret,
  getHost,
  getToken,
  setHost,
  setToken,
  isOnline,
  setStarted,
} from 'redux/credentials'
import { addAssistantMessage, addUserMessage } from 'redux/messages'
import { getStage } from './os.selectors'
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
        console.log('next message')
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
    console.log('message')
    dispatch(addAssistantMessage(message))
  })
}

export const processUserMessage = message => (dispatch, getState) => {
  if (stage === READY_FOR_DISCUSSION) {
    dispatch(addUserMessage(message, true))
  } else {
    dispatch(addUserMessage(message))
    if (nextUserMessageCallback) {
      nextUserMessageCallback(message)
    }
  }
}

// const tryConnection = () => (dispatch, getState) => {
//   const state = getState()
//   if (!getHost(state)) {
//     dispatch(
//       addMessage(
//         'other',
//         'Please provide me the url of a virtual assistant to connect to.',
//         'text'
//       )
//     )
//   } else if (!getToken(state)) {
//     dispatch(
//       addMessage(
//         'other',
//         'Please provide me the token of the assistant.',
//         'text'
//       )
//     )
//   } else {
//     dispatch(init(getHost(state), getToken(state)))
//   }
// }

export const SET_MEMORY = 'SET_MEMORY'
export const setMemory = memory => ({
  type: SET_MEMORY,
  payload: { memory },
})
