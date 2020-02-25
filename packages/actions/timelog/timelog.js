import { Action, Collection } from '@assistant-os/common'

const action = new Action('timelog')

const collection = new Collection(action.name, [])

action.onStart = () => collection.start()

const saveNewDate = (message, project, type) =>
  collection.append({ project, userId: message.userId, start: new Date(), stop: null })

action.if('start {word:project}').then(async ({ message, params, answer }) => {
  const { project } = params
  await answer(`Enter start work for "${project}" in timelog`)
  collection.append({ project, userId: message.userId, start: new Date(), stop: null })
})
// .autoComplete((done, message) => {
//   if ('start '.includes(message.text)) {
//     const completionChoices = collection
//       .db()
//       .filter({ userId: message.userId })
//       .sortBy('date')
//       .take(4)
//       .value()
//       .map(({ project }) => ({ priority: 1, text: `start ${project}` }))

//     done(completionChoices)
//   } else if (message.text.includes('start ')) {
//     const projectName = message.text.replace('start ', '')
//     const completionChoices = collection
//       .db()
//       .filter({ userId: message.userId })
//       .value()
//       .filter(({ project }) => project.includes(projectName))
//       .map(({ project }) => ({ priority: 1, text: `start ${project}` }))

//     done(completionChoices)
//   } else {
//     done([])
//   }
// })

action.if('stop {word:project}').then(async ({ message, params, answer }) => {
  const { project } = params
  await answer(`Enter stop work for "${project}" in timelog`)
  collection.append({ project, userId: message.userId, start: new Date(), stop: null })
  saveNewDate(message, project, 'stop')
})

action
  .if('weektime {word: project}')
  .then(async ({ message, params, answer }) => {
    const currentWeek = getWeekNumber(new Date())

    collection
      .db()
      .filter({ userId: message.userId, project: params.project })
      .value()
      .filter(({ date }) => getWeekNumber(new Date(date)) === currentWeek)
      .map((sum, ))
  })

const getWeekNumber = date => {
  var oneJan = new Date(date.getFullYear(), 0, 1)

  // calculating number of days
  //in given year before given date

  var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000))

  // adding 1 since this.getDay()
  //returns value starting from 0

  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7)
}

export default action
