import { Action } from '@assistant-os/common'

const action = new Action('timelog')

action.when('"timelog"').then(({ context }) => {
  context.sendTextMessage('timelog')
})

action.when('"timelog" "start" {word:project}').then(({ project, context }) => {
  context.sendTextMessage('start timelog', project)
})

action.when('"timelog" "stop" {word:project}').then(({ project, context }) => {
  context.sendTextMessage('stop timelog', project)
})

export default action
