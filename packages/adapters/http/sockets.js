const sockets = {}

export const addSocket = (user, socket) => (sockets[user.adapter.id] = socket)

export const getSocket = user => {
  // console.log('user', user.adapter.id, sockets)

  return sockets[user.adapter.id]
}

export default { add: addSocket, get: getSocket }
