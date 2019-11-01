import db from '@assistant-os/utils/db'

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
    .push({ email, userId })
    .write()
}

export const has = (expectedEmail, expectedUserId) =>
  db()
    .get(TABLE_NAME)
    .find(
      ({ email, userId }) =>
        email === expectedEmail && userId === expectedUserId
    )
    .value()
