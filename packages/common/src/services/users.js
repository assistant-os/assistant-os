import uuidv1 from 'uuid/v1'

import db from './db'

const TABLE_NAME = 'users'

if (
  db() &&
  !db()
    .has(TABLE_NAME)
    .value()
) {
  db()
    .set(TABLE_NAME, [])
    .write()
}

const addUser = (adapterName, adapterUserId, meta = {}) =>
  db()
    .get(TABLE_NAME)
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
    .get(TABLE_NAME)
    .find(
      ({ adapters }) =>
        adapters[adapterName] && adapters[adapterName].id === adapterUserId
    )
    .value()

  if (user === null || user === undefined) {
    user = addUser(adapterName, adapterUserId, meta)
  } else {
    console.log('user.adapters', user.adapters[adapterName])
    const newAdapters = {
      ...user.adapters,
      [adapterName]: {
        ...user.adapters[adapterName],
        meta,
      },
    }
    user = db()
      .get(TABLE_NAME)
      .find(
        ({ adapters }) =>
          adapters[adapterName] && adapters[adapterName].id === adapterUserId
      )
      .assign({ ...user, adapters: newAdapters })
      .write()
  }

  return findUserById(user.id, adapterName)
}

const clearUser = (user, adapter) => {
  const { id, name, token, adapters } = user

  return { id, name, token, adapter: adapters[adapter] }
}

const findUserById = (id, adapterName = null) => {
  const user = db()
    .get(TABLE_NAME)
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

  update(id, toUpdate) {
    return db()
      .get('users')
      .find({ id })
      .assign(toUpdate)
      .write()
  }
}
