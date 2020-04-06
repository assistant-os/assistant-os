import { promises as fs } from 'fs'
import path from 'path'
import { format } from 'date-fns'

import * as projectService from '../services/project.service'
import * as WorkTime from '../services/worktime.service'

import logger from '../utils/logger'

const csvFilename = path.join(__dirname, '../../.data/timelog.csv')

export const init = () => WorkTime.init()

const userId = 'userId'

export const getAvailableActions = async query => {
  const actions = []
  const currentWork = await WorkTime.getLastStartedProjectByName(query, userId)
  if (currentWork) {
    actions.push({
      type: 'stop-project',
      id: `stop-project-${currentWork.project.id}`,
      label: currentWork.project.name,
      subLabel: 'stop',
      section: 'timelog',
      priority: 1,
      icon: 'time',
      detail: 'get-timing',
      payload: {
        project: {
          id: currentWork.project.id,
          name: currentWork.project.name,
        },
        workTime: {
          startedAt: currentWork.startedAt,
          currentDateTime: new Date(),
        },
      },
    })
  }

  const projects = (await WorkTime.getProjectsByUserIdAndCloseName(
    userId,
    query
  )).filter(p => !currentWork || currentWork.project.id !== p.id)

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
      detail: 'get-timing',
      payload: {
        project: {
          id: p.id,
          name: p.name,
        },
        workTime: {},
      },
    })),
  ].filter(a => Boolean(a))
}

export const executionAction = async ({ action, query, close, keep }) => {
  if (action.type === 'start-project') {
    await WorkTime.start(action.payload.project.id, userId)
    keep()
  } else if (action.type === 'stop-project') {
    const workTime = await WorkTime.stop(action.payload.project.id, userId)

    logger.info({ workTime })

    if (workTime) {
      const data = [
        format(workTime.startedAt, 'dd/MM/yyyy'),
        format(workTime.startedAt, 'HH:mm'),
        format(workTime.stoppedAt, 'HH:mm'),
        action.label,
      ]
      await fs.appendFile(csvFilename, data.join(','))
    }
    keep()
  }
}

export const getData = async ({ request, action }) => {
  if (request.type === 'get-timing') {
    const data = await WorkTime.getTimingByProject(action.payload.project.id)
    logger.info({ data })
    return {
      id: action.id,
      ...data,
    }
  }

  return null
}
