import path from 'path'

import * as projects from '../services/project.service'

export const init = () => projects.init()

const userId = 'userId'

export const getAll = () => projects.getByUserId(userId)

export const getAvailableActions = query =>
  projects.getOneByUserIdAndExactName(userId, query).then(project =>
    project || query.includes('=')
      ? []
      : [
          {
            type: 'create-project',
            id: 'create-project',
            label: query,
            subLabel: 'create project',
            section: 'projects',
            priority: 10,
            icon: 'add',
          },
        ]
  )

export const executionAction = async ({ action, query, close, keep }) => {
  if (action.type === 'create-project') {
    await projects.add(action.label, userId)
    keep()
  }
}
