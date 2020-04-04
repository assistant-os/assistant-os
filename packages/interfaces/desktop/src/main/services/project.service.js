import { promises as fs, constants } from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

import { init as initDb, sequelize } from './db'

export class Project extends Sequelize.Model {}

export const init = async () => {
  Project.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: Sequelize.STRING,
      name: Sequelize.STRING,
    },
    {
      sequelize: sequelize(),
      modelName: 'project',
      uniqueKeys: {
        project_unique_by_user: {
          fields: ['userId', 'name'],
        },
      },
    }
  )

  return Promise.resolve()
}

export const add = (projectName, userId) =>
  Project.create({ name: projectName, userId, startAt: new Date() })

export const getByUserId = userId => Project.findAll({ where: { userId } })

export const getById = (id, userId) =>
  Project.findOne({ where: { id, userId } })

export const getOneByUserIdAndExactName = (userId, name) =>
  Project.findOne({ where: { userId, name } })
