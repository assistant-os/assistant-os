export const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = (emitter, content, format = 'text') => ({
  type: ADD_MESSAGE,
  payload: {
    emitter,
    content,
    format,
    date: Date.now(),
  },
})

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES'
export const clearMessages = () => ({
  type: CLEAR_MESSAGES,
})
