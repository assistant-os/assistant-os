import { db } from '@assistant-os/common'

const TABLE_NAME = 'memories'

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

export const add = (key, value, userId) => {
  db()
    .get(TABLE_NAME)
    .remove({ key, userId })
    .write()
  db()
    .get(TABLE_NAME)
    .push({ key, value, userId })
    .write()
}

export const remove = (key, userId) => {
  db()
    .get(TABLE_NAME)
    .remove({ key, userId })
    .write()
}

export const update = ({ key, value, userId }) =>
  db()
    .get(TABLE_NAME)
    .find({ key, userId })
    .assign({ key, userId, value })
    .write()

export const getValue = (key, userId) => {
  console.log('key', key, userId)

  return db()
    .get(TABLE_NAME)
    .find({ key, userId })
    .value().value
}

export const has = (key, userId) =>
  Boolean(
    db()
      .get(TABLE_NAME)
      .find({ key, userId })
      .value()
  )
