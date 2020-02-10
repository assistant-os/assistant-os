import { Action } from '@assistant-os/common'

const action = new Action('oups')

action
  .then(({ answer }) => {
    answer(`Sorry I don't understand your request.`)
  })
  .withPriority(0.1)

export default action
