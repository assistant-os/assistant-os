import { Action } from '@assistant-os/common'

import * as memories from './memories'

const action = new Action('memory')

action.onStart = memories.initializeTable

action.if('save {word:key} {.*:value}').then(({ message, params, answer }) => {
  const { key, value } = params
  memories.add(key, value, message.userId)
  answer(`Ok I saved "${key}" with value "${value}".`)
})

action.if('rm {word:key}').then(({ message, params, answer }) => {
  const { key } = params

  if (memories.has(key, message.userId)) {
    memories.remove(key, message.userId)
    answer(`Ok I removed "${key}".`)
  } else {
    answer(`Sorry it didn't remember "${key}" yet.`)
  }
})

const isInMemory = message =>
  Promise.resolve(memories.has(message.text, message.userId))

action
  .if('{word:key}')
  .and(isInMemory)
  .then(({ message, answer }) => {
    answer(memories.getValue(message.text, message.userId), {
      straight: true,
    })
  })
  .withPriority(0.4)

export default action
