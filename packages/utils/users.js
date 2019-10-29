import uuidv1 from 'uuid/v1'

import db from './db'

if (!db.has('users').value()) {
  db.set('users', []).write()
}

db.set('users.friedrit', {
  id: 'friedrit',
  adapters: {
    slack: {
      id: 'D2TRY4S15',
      meta: { channel: 'DPUKWK4G0' },
    },
  },
})

const addUser = (adapter, adapterUserId, meta = {}) => {
  return db
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

const findOrCreateUSerByAdapter = (adapter, adapterUserId, meta) => {
  let user = db
    .get('users')
    .find(
      ({ adapters }) =>
        adapters[adapter] && adapters[adapter].id === adapterUserId
    )
    .value()

  if (user === null) {
    user = addUser(adapter, adapterUserId, meta)
  } else {
    const adapters = {
      ...user.adapters,
      [adapter]: {
        ...user.adapters[adapter],
        meta,
      },
    }
    user = db
      .get('user')
      .find(
        ({ adapters }) =>
          adapters[adapter] && adapters[adapter].id === adapterUserId
      )
      .assign({ adapters })
      .write()
  }

  return user
}

const clearUser = (user, adapter) => {
  const { id, name, token, adapters } = user

  return { id, name, token, adapter: adapters[adapter] }
}

const findUserById = (id, adapter = null) => {
  const user = db
    .get('users')
    .find(user => user.id === id)
    .value()

  return adapter ? clearUser(user, adapter) : user
}

export default class Users {
  static findOrCreateByAdapter = findOrCreateUSerByAdapter
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
