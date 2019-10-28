export const generateRandomToken = () =>
  Buffer.from(Math.random().toString()).toString('base64')
