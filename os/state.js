// import User from '../models/user'

const state = {}

export default class State {
  constructor (middleware) {
    this.middleware = middleware
  }

  initializeUserSpace (user) {
    // if (user instanceof User) {
      if (! state.hasOwnProperty(user.id)) {
        state[user.id] = {}
      }
    // } else {
    //   throw 'user must be an instance of User'
    // }
  }

  get (user, key = null) {
    // if (user instanceof User) { // user must be an instance of User
      if (state.hasOwnProperty(user.id)) { // user must be in the state
        if (key) { // key must not be empty
          if (key.match(/\/[a-zA-Z\-]+/)) { // if key begins with a "/"
            return state[user.id][key] // we look in all state
          } else {
            return state[user.id][`${this.middleware.getPathId()}/${key}`]
          }
        } else {
          // return all os state for user
          return null
        }
      } else {
        return null
      }
    // } else {
    //   throw 'user must be an instance of User'
    // }
  }

  set (user, key = null, value = '') {
    // if (user instanceof User) {
      this.initializeUserSpace(user)
      if (key && value) {
        if (key.match(/\/[a-zA-Z\-]+/)) { // if key begins with a "/"
          state[user.id][key] = value
        } else {
          return state[user.id][`${this.middleware.getPathId()}/${key}`] = value
        }
      }
    // } else {
    //   throw 'user must be an instance of User'
    // }
  }

  remove (user, key) {
    // if (user instanceof User) {
      if (state.hasOwnProperty(user.id)) { // user must be in the state
        if (key) {
          if (key.match(/\/[a-zA-Z\-]+/)) { // if key begins with a "/"
            delete state[user.id][key]
          } else {
            delete state[user.id][`${this.middleware.getPathId()}/${key}`]
          }
        }
      }
    // } else {
    //   throw 'user must be an instance of User'
    // }
  }
}
