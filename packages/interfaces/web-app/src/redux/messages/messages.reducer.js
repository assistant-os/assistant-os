import { ADD_MESSAGE, CLEAR_MESSAGES } from './messages.actions.js'

const initState = {
  list: [],
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        list: [...state.list, action.payload.message],
      }
    case CLEAR_MESSAGES:
      return initState
    default:
      return state
  }
}

export default reducer
