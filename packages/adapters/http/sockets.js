const sockets = {}

export const addSocket = (user, socket) => (sockets[user.adapter.id] = socket)

export const getSocket = user => sockets[user.adapter.id]

export default { add: addSocket, get: getSocket }
