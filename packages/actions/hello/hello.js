import { Action, getASynonym, Users, identity } from '@assistant-os/common'

const READY_TO_SET_NAME = 'ready-to-set-name'
const READY_TO_CONFIRM = 'ready-to-confirm'

const action = new Action('hello')

const users = new Users()

action.when(READY_TO_SET_NAME).then(({ message, answer, setStatus }) => {
  answer(`So you confirm your name is "${message.text}"?`)
  setStatus(READY_TO_CONFIRM, { name: message.text })
})

action
  .if('yes')
  .when(READY_TO_CONFIRM)
  .then(({ context, message, answer, setStatus }) => {
    answer(`${getASynonym('ok')}!`)
    users.update(message.userId, { name: context.name })
    setStatus(null)
  })

action
  .if('no')
  .when(READY_TO_CONFIRM)
  .then(({ setStatus, answer }) => {
    answer(`${getASynonym('ok')}, try again. What is your name?`)
    setStatus(READY_TO_SET_NAME)
  })

const wait = delay => new Promise(resolve => setTimeout(() => resolve(), delay))

action.if('~hello').then(async ({ message, answer, setStatus }) => {
  let user = users.findById(message.userId)

  const helloSynonym = getASynonym('hello')
  if (user.name === 'unknown') {
    answer(helloSynonym)
    await wait(1000)
    answer(`my name is ${identity.getName()}`)
    await wait(1000)
    answer('what is your name?')
    setStatus(READY_TO_SET_NAME)
  } else {
    answer(`${helloSynonym} ${user.name}!`)
  }
})

export default action
