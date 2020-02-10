const sockets = {}

export const add = (socket, user) => (sockets[user.adapter.id] = socket)

export const find = user => {
  // console.log('user', user.adapter.id, sockets)

  return sockets[user.adapter.id]
}
