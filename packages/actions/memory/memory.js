import { Action } from '@assistant-os/common'

import * as Memories from './memories'

const action = new Action('memory')

action.onStart = Memories.initializeTable

action
  .add('save-key-value')
  .when('save {word:key} {.*:value}')
  .then(({ key, value, context, userId }) => {
    Memories.add(key, value, userId)
    context.sendTextMessage(`Ok I saved "${key}".`)
  })

action
  .add('remove-key-value')
  .when('rm {word:key}')
  .then(({ key, context, userId }) => {
    if (Memories.has(key, userId)) {
      Memories.remove(key, userId)
      context.sendTextMessage(`Ok I removed "${key}".`)
    } else {
      context.sendTextMessage(`Sorry it didn't remember "${key}" yet.`)
    }
  })

action
  .add('get-key-value')
  .when('{word:key}')
  .and(Memories.has)
  .then(({ text, context, userId }) => {
    context.sendTextMessage(Memories.get(text, userId).value, {
      straight: true,
    })
  })

export default action
