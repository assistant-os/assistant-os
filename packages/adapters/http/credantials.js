import { db } from '@assistant-os/common'

const TABLE_NAME = 'httpCredentials'
const SECRET_KEY = `${TABLE_NAME}.secret`

const rand = () =>
  Math.random(0)
    .toString(36)
    .substr(2)

const token = length => (rand() + rand() + rand() + rand()).substr(0, length)

export const getSecret = async () =>
  Promise.resolve(
    db()
      .get(SECRET_KEY)
      .value()
  )

export const setup = async () => {
  const secret = await getSecret()
  if (!secret) {
    db()
      .set(SECRET_KEY, token(128))
      .write()
  }
}
