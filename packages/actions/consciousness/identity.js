import { Action, identity } from '@assistant-os/common'

const action = new Action('identity')

action.if('your name is {word:name}').then(({ params, answer }) => {
  const { name } = params
  identity.setName(name)
  answer(`Ok my new name is "${name}"".`)
})

export default action
