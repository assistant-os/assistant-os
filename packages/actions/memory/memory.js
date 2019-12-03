import { Action } from '@assistant-os/common'

import * as Memories from './memories'

const action = new Action('memory')

const hasToken = (text, userId) => Memories.has(text, userId)

action
  .when('save {word:key} {.*:value}')
  .then(({ key, value, context, userId }) => {
    Memories.add(key, value, userId)
    context.sendTextMessage(`Ok I saved "${key}".`)
  })

action.when('rm {word:key}').then(({ key, context, userId, text }) => {
  if (hasToken(text, userId)) {
    Memories.remove(key, userId)
    context.sendTextMessage(`Ok I removed "${key}".`)
  } else {
    context.sendTextMessage(`Sorry it didn't remember "${key}" yet.`)
  }
})

action
  .when('{word:key}')
  .and(hasToken)
  .then(({ text, context, userId }) => {
    context.sendTextMessage(Memories.get(text, userId).value, {
      straight: true,
    })
  })

export default action
