import uuidv1 from 'uuid/v1'

import db from './db'

if (
  db() &&
  !db()
    .has('users')
    .value()
) {
  db()
    .set('users', [
      {
        id: 'friedrit',
        name: 'Thibault',
        token: uuidv1(),
        adapters: {
          slack: {
            id: 'U2TS4D7NW',
            meta: { channel: 'DPUKWK4G0' },
          },
        },
      },
    ])
    .write()
}

const addUser = (adapter, adapterUserId, meta = {}) => {
  return db()
    .get('users')
    .push({
      id: uuidv1(),
      name: 'unknown',
      token: uuidv1(),
      adapters: {
        [adapter]: {
          id: adapterUserId,
          meta,
        },
      },
    })
    .write()
}

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

const findUserById = (id, adapter = null) => {
  const user = db()
    .get('users')
    .find(user => user.id === id)
    .value()

  return adapter ? clearUser(user, adapter) : user
}

export default class Users {
  static findOrCreateByAdapter = findOrCreateUserByAdapter
  static findById = findUserById

  constructor(adapterName) {
    this.adapterName = adapterName
  }

  findOrCreateByAdapter(...args) {
    return Users.findOrCreateByAdapter(this.adapterName, ...args)
  }

  findById(userId) {
    return Users.findById(userId, this.adapterName)
  }
}
