import { promises as fs, constants } from 'fs'
import path from 'path'
import Sequelize, { Op } from 'sequelize'
import { startOfWeek, startOfDay, differenceInMinutes } from 'date-fns'

import { init as initDb, sequelize } from './db'
import * as projectService from './project.service'
import logger from '../utils/logger'

const { Project } = projectService

export class WorkTime extends Sequelize.Model {}

const sumDuration = (sum, { startedAt, stoppedAt }) =>
  sum + differenceInMinutes(new Date(stoppedAt), new Date(startedAt))

export const init = async () => {
  WorkTime.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      startedAt: Sequelize.DATE,
      stoppedAt: {
        type: Sequelize.DATE,
        nullable: true,
      },
    },
    {
      sequelize: sequelize(),
      modelName: 'worktime',
    }
  )

  Project.hasMany(WorkTime)
  WorkTime.belongsTo(Project)

  Project.sync({ alter: true })

  WorkTime.sync({ alter: true })

  return Promise.resolve()
}

export const start = async (projectId, userId) => {
  const project = await projectService.getById(projectId, userId)
  if (!project) {
    return
  }

  return await WorkTime.create({
    startedAt: new Date(),
    stoppedAt: null,
    projectId: project.id,
  })
}

export const getProjectsByUserIdAndCloseName = (userId, name) =>
  Project.findAll({
    attributes: [
      'id',
      'name',
      [
        sequelize().fn('max', sequelize().col('worktimes.startedAt')),
        'priority',
      ],
    ],
    where: {
      userId,
      name: sequelize().where(
        sequelize().fn('LOWER', sequelize().col('name')),
        'LIKE',
        `${name.toLowerCase()}%`
      ),
    },
    include: [
      {
        model: WorkTime,
        // limit: 1,
      },
    ],
    order: [[sequelize().col('priority'), 'DESC']],
    group: ['project.id'],
    // raw: trxue,
  })

export const getTimingByProject = async projectId => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  const workTimes = await WorkTime.findAll({
    where: {
      startedAt: {
        [Op.gte]: monday,
      },
      stoppedAt: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        model: Project,
        where: {
          id: projectId,
        },
      },
    ],
  })

  logger.info({ workTimes, monday })

  const weekly = workTimes.reduce(sumDuration, 0)

  const daily = workTimes
    .filter(({ startedAt }) => startedAt > startOfDay(new Date()))
    .reduce(sumDuration, 0)

  return { weekly, daily }
}

export const getLastStartedProjectByName = (projectName, userId) =>
  WorkTime.findOne({
    where: {
      stoppedAt: null,
    },
    include: [
      {
        model: Project,
        where: {
          name: sequelize().where(
            sequelize().fn('LOWER', sequelize().col('name')),
            'LIKE',
            `${projectName.toLowerCase()}%`
          ),
          userId,
        },
      },
    ],
    order: [['startedAt', 'DESC']],
  })

const getLastStartedProjectById = (projectId, userId) =>
  WorkTime.findOne({
    where: {
      stoppedAt: null,
    },
    include: [
      {
        model: Project,
        where: {
          id: projectId,
          userId,
        },
      },
    ],
    order: [['startedAt', 'DESC']],
  })

export const stop = async (projectId, userId) => {
  const workTime = await getLastStartedProjectById(projectId, userId)
  if (workTime) {
    workTime.stoppedAt = new Date()
    await workTime.save()
  }
}

// export const stop = project =>
//   getLast(project).then(workTime => {
//     if (workTime) {
//       workTime.stoppedAt = new Date()
//       workTime.save()
//     }
//   })

// export const getLastStartedProject = projectName =>
//   WorkTime.findOne({
//     where: {
//       'project.name': sequelize.where(
//         sequelize.fn('LOWER', sequelize.col('project.name')),
//         'LIKE',
//         '%' + projectName.toLowerCase() + '%'
//       ),
//     },
//     order: [['startedAt', 'DESC']],
//   })

// export const getAllProjects = projectName =>
//   Project.findAll({
//     where: {
//       name: sequelize.where(
//         sequelize.fn('LOWER', sequelize.col('project.name')),
//         'LIKE',
//         '%' + projectName.toLowerCase() + '%'
//       ),
//     },
//   })
