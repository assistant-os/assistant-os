import * as projectService from '../services/project.service'
import * as workTime from '../services/worktime.service'

export const init = () => workTime.init()

const userId = 'userId'

export const getAvailableActions = async query => {
  const actions = []
  const currentWork = await workTime.getLastStartedProjectByName(query, userId)
  if (currentWork) {
    actions.push({
      type: 'stop-project',
      id: `stop-project-${currentWork.project.id}`,
      label: currentWork.project.name,
      subLabel: 'stop',
      section: 'timelog',
      priority: 1,
      icon: 'time',
      payload: {
        project: {
          id: currentWork.project.id,
          name: currentWork.project.name,
        },
        workTime: {
          startedAt: currentWork.startedAt,
          currentDateTime: new Date(),
          ...(await workTime.getTimingByProject(currentWork.project.id)),
        },
      },
    })
  }

  const projects = (await workTime.getProjectsByUserIdAndCloseName(
    userId,
    query
  )).filter(p => !currentWork || currentWork.project.id !== p.id)

  const workTimes = await Promise.all(
    projects.map(p => workTime.getTimingByProject(p.id))
  )

  return [
    ...actions,
    ...projects.map((p, index) => ({
      type: 'start-project',
      id: `start-project-${p.id}`,
      label: p.name,
      subLabel: 'start',
      section: 'timelog',
      priority: 2,
      icon: 'time',
      payload: {
        project: {
          id: p.id,
          name: p.name,
        },
        workTime: workTimes[index],
      },
    })),
  ].filter(a => Boolean(a))
}

export const executionAction = async ({ action, query, close, keep }) => {
  if (action.type === 'start-project') {
    await workTime.start(action.payload.project.id, userId)
    keep()
  } else if (action.type === 'stop-project') {
    await workTime.stop(action.payload.project.id, userId)
    keep()
  }
}
