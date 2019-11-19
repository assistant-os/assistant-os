import { db } from '@assistant-os/utils'

const TABLE_NAME = 'movies'

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
