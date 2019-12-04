import { Action, getASynonym, Message, Users } from '@assistant-os/common'

const READY_TO_SET_NAME = 'ready-to-set-name'
const READY_TO_CONFIRM = 'ready-to-confirm'

const action = new Action('hello')

const users = new Users()

action
  .when(null)
  .if(READY_TO_SET_NAME)
  .then(({ context, text }) => {
    context.sendTextMessage(`So you confirm your name is "${text}"?`)
    context.setStatus(READY_TO_CONFIRM, { name: text })
  })

action
  .when(Message.isCloseToWord('yes'))
  .if(READY_TO_CONFIRM)
  .then(({ context, userId }) => {
    context.sendTextMessage(`${getASynonym('ok')}!`)
    users.update(userId, { name: context.get('name') })
    context.setDefaultStatus()
  })

action
  .when(Message.isCloseToWord('no'))
  .if(READY_TO_CONFIRM)
  .then(({ context }) => {
    context.sendTextMessage(
      `${getASynonym('ok')}, try again. What is your name?`
    )
    context.setStatus(READY_TO_SET_NAME)
  })

action
  .when(Message.isCloseToWord('hello'))
  .then(async ({ context, userId }) => {
    let user = users.findById(userId)

    const helloSynonym = getASynonym('hello')

    if (user.name === 'unknown') {
      context.sendTextMessage(`${helloSynonym}!`)
      await new Promise(resolve => setTimeout(() => resolve(), 1000))
      context.sendTextMessage('What is your name?')
      context.setStatus(READY_TO_SET_NAME)
    } else {
      context.sendTextMessage(`${helloSynonym} ${user.name}!`)
    }
  })

export default action
