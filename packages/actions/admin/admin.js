import { Action } from '@assistant-os/common'

const action = new Action('admin')

action
  .if('restart')
  .then(() => {
    process.exit(3) // eslint-disable-line no-process-exit
  })
  .withPriority(0.001)

export default action
