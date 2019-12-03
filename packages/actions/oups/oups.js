import { Action } from '@assistant-os/common'

const action = new Action('oups')

action.when(null, 0.1).then(({ context }) => {
  context.sendTextMessage(`Sorry I don't understand your request.`)
})

export default action
