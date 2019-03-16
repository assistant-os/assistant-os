import { SET_MEMORY } from './os.actions.js'

const initState = {
  memory: {},
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_MEMORY:
      return {
        ...state,
        memory: { ...state.memory, ...action.payload.memory },
      }
    default:
      return state
  }
}

export default reducer
