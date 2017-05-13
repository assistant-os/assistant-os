let state = {}

const initialize = (user) => {
  if (!state[user.id]) {
    state[user.id] = {}
  }
}

const get = (user, key = null) => {
  if (key) {
    if (state[user.id]) {
      return state[user.id][key]
    } else {
      return null
    }
  } else {
    return state[user.id]
  }
}

const set = (user, key, value) => {
  initialize(user)
  state[user.id][key] = value
}

const remove = (user, key) => {
  if (key) {
    delete state[user.id][key]
  } else {
    delete state[user.id]
  }
}

export default {
  set,
  get,
  remove
}
