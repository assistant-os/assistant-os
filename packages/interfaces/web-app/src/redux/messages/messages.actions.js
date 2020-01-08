import { send } from 'utils/socket'
import { generateRandom } from 'utils/random'

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = message => ({
  type: ADD_MESSAGE,
  payload: {
    message: {
      id: generateRandom(),
      ...message,
      date: Date.now(),
    },
  },
})

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES'
export const clearMessages = () => ({
  type: CLEAR_MESSAGES,
})

export const addUserMessage = (m, sendIt = false) => dispatch => {
  const message = {
    ...m,
    emitter: 'user',
  }

  dispatch(addMessage(message))
  if (sendIt) {
    send(m)
  }
}

export const addAssistantMessage = m => dispatch => {
  const message = {
    ...m,
    emitter: 'assistant',
  }

  dispatch(addMessage(message))
}
