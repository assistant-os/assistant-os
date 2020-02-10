const threads = {}

const lastAdapterUsedByUsers = {}

const adapters = {}

export const add = (message, fromAdapter) => {
  threads[message.id] = {
    message,
    fromAdapterName: fromAdapter.name,
  }

  adapters[fromAdapter.name] = fromAdapter

  lastAdapterUsedByUsers[message.userId] = fromAdapter.name
}

const findPreviousMessageAdapterName = message =>
  'previousMessageId' in message
    ? threads[message.previousMessageId].fromAdapterName
    : null

const findLastAdapterNameUsedBy = userId => lastAdapterUsedByUsers[userId]

export const findBestAdapter = message => {
  let adapterName = findPreviousMessageAdapterName(message)

  if (!adapterName) {
    adapterName = findLastAdapterNameUsedBy(message.userId)
  }

  if (adapterName) {
    return adapters[adapterName]
  }

  return null
}
