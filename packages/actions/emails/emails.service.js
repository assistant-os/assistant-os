import { db } from '@assistant-os/utils'

const TABLE_NAME = 'emails'

export const initializeTable = () => {
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
}

export const add = (email, userId) => {
  db()
    .get(TABLE_NAME)
    .push({ email, userId, hacks: [] })
    .write()
}

export const remove = (email, userId) => {
  db()
    .get(TABLE_NAME)
    .remove({ email, userId })
    .write()
}

export const update = ({ email, userId, hacks }) =>
  db()
    .get(TABLE_NAME)
    .find({ email, userId })
    .assign({ email, userId, hacks })
    .write()

export const getAll = () =>
  db()
    .get(TABLE_NAME)
    .value()

export const get = (email, userId) =>
  db()
    .get(TABLE_NAME)
    .find({ email, userId })
    .value()

export const has = (...args) => Boolean(get(...args))
