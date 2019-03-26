import { ADD_MESSAGE, CLEAR_MESSAGES } from './discussion.actions.js'

const initState = {
  messages: [],
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [ ...state.messages, action.payload ],
      }
    case CLEAR_MESSAGES:
      return initState
    default:
      return state
  }
}

export default reducer
