import uuidv1 from 'uuid/v1'

import db from './db'

if (
  db() &&
  !db()
    .has('users')
    .value()
) {
  db()
    .set('users', [])
    .write()
}

const addUser = (adapterName, adapterUserId, meta = {}) =>
  db()
    .get('users')
    .push({
      id: uuidv1(),
      name: 'unknown',
      token: uuidv1(),
      adapters: {
        [adapterName]: {
          id: adapterUserId,
          meta,
        },
      },
    })
    .write()[0]

const findOrCreateUserByAdapter = (adapterName, adapterUserId, meta = {}) => {
  let user = db()
    .get('users')
    .find(
      ({ adapters }) =>
        adapters[adapterName] && adapters[adapterName].id === adapterUserId
    )
    .value()

  if (user === null || user === undefined) {
    user = addUser(adapterName, adapterUserId, meta)
    console.log('user', user)
  } else {
    const newAdapters = {
      ...user.adapters,
      [adapterName]: {
        ...user.adapters[adapterName],
        meta,
      },
    }
    user = db()
      .get('user')
      .find(
        ({ adapters }) =>
          adapters[adapterName] && adapters[adapterName].id === adapterUserId
      )
      .assign({ ...user, adapters: newAdapters })
      .write()
  }

  return user
}

const clearUser = (user, adapter) => {
  const { id, name, token, adapters } = user

  return { id, name, token, adapter: adapters[adapter] }
}

const findUserById = (id, adapterName = null) => {
  const user = db()
    .get('users')
    .find(user => user.id === id)
    .value()

  return adapterName ? clearUser(user, adapterName) : user
}

export default class Users {
  static findOrCreateByAdapter = findOrCreateUserByAdapter
  static findById = findUserById

  constructor(adapterName = null) {
    this.adapterName = adapterName
  }

  findOrCreateByAdapter(...args) {
    return Users.findOrCreateByAdapter(this.adapterName, ...args)
  }

  findById(userId) {
    return Users.findById(userId, this.adapterName)
  }
}
