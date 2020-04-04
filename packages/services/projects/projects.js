import { promises as fs, constants } from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

let sequelize = null

class Project extends Sequelize.Model {}

export const init = async (
  filename,
  database = 'database',
  username = 'username',
  password = 'password'
) => {
  const dirname = path.dirname(filename)

  await fs
    .access(dirname, constants.R_OK | constants.W_OK)
    .catch(() => fs.mkdir(dirname))

  sequelize = new Sequelize(database, username, password, {
    dialect: 'sqlite',
    storage: filename,
  })

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
      sequelize,
      modelName: 'project',
    }
  )

  return Promise.resolve()
}

export const add = (projectName, userId) =>
  Project.create({ name: projectName, userId, startAt: new Date() })

export const getByUserId = userId => Project.findAll({ where: { userId } })
