import { generateRandomToken } from './id'

const users = {
  friedrit: {
    id: 'friedrit',
    adapters: {
      slack: {
        id: 'D2TRY4S15',
        meta: { channel: 'DPUKWK4G0' },
      },
    },
  },
}

const addUser = (adapter, adapterUserId) => {
  const id = generateRandomToken()
  users[id] = {
    id,
    name: 'unknown',
    token: generateRandomToken(),
    adapters: {
      [adapter]: {
        id: adapterUserId,
      },
    },
  }

  return users[id]
}

const findOrCreateUSerByAdapter = (adapter, adapterUserId, meta) => {
  let user = null
  let userId = Object.keys(users).find(
    userId => (users[userId].adapters[adapter].id = adapterUserId)
  )

  if (userId === undefined) {
    user = addUser(adapter, adapterUserId)
  } else {
    user = users[userId]
  }

  user.adapters[adapter].meta = meta

  return user
}

const clearUser = (user, adapter) => {
  const { id, name, token, adapters } = user

  return { id, name, token, adapter: adapters[adapter] }
}

const findUserById = (id, adapter = null) => {
  const user = users[id]

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
