import { Action } from '@assistant-os/common'

import Http from '@assistant-os/http'

const action = new Action('admin')

action
  .if('restart')
  .then(() => {
    process.exit(3) // eslint-disable-line no-process-exit
  })
  .withPriority(0.001)

action.if('http secret').then(({ answer }) => {
  const instance = Http.getInstance()
  if (instance) {
    answer(`Secret for http adapter is "${instance.secret}"`)
  } else {
    answer('No instance found')
  }
})

export default action
