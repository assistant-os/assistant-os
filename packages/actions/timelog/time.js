import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const dataFolder = path.join(__dirname, '../../../data')

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder)
}

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: path.join(dataFolder, 'time.sqlite'),
})

class ProjectTask extends Sequelize.Model {}
ProjectTask.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: Sequelize.STRING,
    project: Sequelize.STRING,
    startAt: Sequelize.DATE,
    stopAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'user',
    // options
  }
)

export const addStartingProject = (project, userId) =>
  ProjectTask.create({ project, userId, startAt: new Date() })

export const addStopProject = async (project, userId) => {}
