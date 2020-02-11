import { Action } from '@assistant-os/common'

const action = new Action('timelog')

action.if('start {word:project}').then(({ params, answer }) => {
  const { project } = params
  answer(`Enter start work for "${project}" in timelog`)
})

action.if('stop {word:project}').then(({ params, answer }) => {
  const { project } = params
  answer(`Enter stop work for "${project}" in timelog`)
})

export default action
