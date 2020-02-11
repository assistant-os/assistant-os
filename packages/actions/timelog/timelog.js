import { Action, Collection } from '@assistant-os/common'

const action = new Action('timelog')

const collection = new Collection(action.name, [])

action.onStart = () => collection.start()

const saveNewDate = (message, project, type) =>
  collection.append({ project, userId: message.userId, date: new Date(), type })

action.if('start {word:project}').then(async ({ message, params, answer }) => {
  const { project } = params
  await answer(`Enter start work for "${project}" in timelog`)
  saveNewDate(message, project, 'start')
})

action.if('stop {word:project}').then(async ({ message, params, answer }) => {
  const { project } = params
  await answer(`Enter stop work for "${project}" in timelog`)
  saveNewDate(message, project, 'stop')
})

export default action
