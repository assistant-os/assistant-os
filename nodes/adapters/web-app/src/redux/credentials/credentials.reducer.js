import {
  SET_TOKEN,
  SET_HOST,
  CLEAR_CREDENTIALS,
  SET_ONLINE,
} from './credentials.actions.js'

const initState = {
  token: '',
  host: '',
  online: false,
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      }
    case SET_HOST:
      return {
        ...state,
        host: action.payload.host,
      }
    case SET_ONLINE:
      return {
        ...state,
        online: action.payload.online,
      }
    case CLEAR_CREDENTIALS:
      return initState
    default:
      return state
  }
}

export default reducer
