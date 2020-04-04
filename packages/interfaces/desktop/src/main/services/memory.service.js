import { promises as fs, constants } from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

import { init as initDb, sequelize } from './db'

export class Memory extends Sequelize.Model {}

export const init = async () => {
  Memory.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: Sequelize.STRING,
      key: Sequelize.STRING,
      value: Sequelize.STRING,
      lastUsedAt: Sequelize.DATE,
    },
    {
      sequelize: sequelize(),
      modelName: 'memory',
      uniqueKeys: {
        key_unique_by_user: {
          fields: ['userId', 'key'],
        },
      },
    }
  )

  Memory.sync({ alter: true })

  return Promise.resolve()
}

export const add = (key, value, userId) => Memory.create({ key, value, userId })

export const getByCloseKeyAndUserId = (userId, key) =>
  Memory.findAll({
    where: {
      userId,
      key: sequelize().where(
        sequelize().fn('LOWER', sequelize().col('key')),
        'LIKE',
        `${key.toLowerCase()}%`
      ),
    },
    order: [[sequelize().col('lastUsedAt'), 'DESC']],
  })

export const getByExactKeyAndUserId = (userId, key) =>
  Memory.findOne({
    where: {
      userId,
      key: sequelize().where(
        sequelize().fn('LOWER', sequelize().col('key')),
        'LIKE',
        key.toLowerCase()
      ),
    },
  })
