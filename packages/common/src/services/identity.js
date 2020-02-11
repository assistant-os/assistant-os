import db from './db'

const TABLE_NAME = 'identity'

export const start = () => {
  if (
    db() &&
    !db()
      .has(TABLE_NAME)
      .value()
  ) {
    db()
      .set(TABLE_NAME, { name: process.env.NAME || 'Jarvis' })
      .write()
  }
}

export const getName = () =>
  db()
    .get(`${TABLE_NAME}.name`)
    .value()

export const setName = name =>
  Promise.resolve(
    db()
      .set(`${TABLE_NAME}.name`, name)
      .write()
  )
