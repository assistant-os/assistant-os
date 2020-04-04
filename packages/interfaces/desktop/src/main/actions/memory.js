import path from 'path'
import { clipboard } from 'electron'

import * as memoryService from '../services/memory.service'

import logger from '../utils/logger'

export const init = () => memoryService.init()

const userId = 'userId'

export const getAvailableActions = async query => {
  const memories = await memoryService.getByCloseKeyAndUserId(userId, query)

  const actions = memories.map(({ key, value, id }) => ({
    type: 'get-memory',
    id: `get-memory-${id}`,
    label: key,
    subLabel: 'copy in clipboard',
    section: 'memory',
    priority: 4,
    icon: 'brain',
  }))

  const match = query.match(/([a-zA-Z0-9\s_\-]+)(=?)(.*)/)

  logger.info({ match })

  if (match && !memories.find(({ key }) => key === match[1])) {
    actions.push({
      type: 'save-memory',
      id: 'save-memory',
      label: `${query}${match[2] ? '' : '='}${match[3] ? '' : '<data>'}`,
      subLabel: 'save',
      section: 'memory',
      priority: 8,
      icon: 'brain',
    })
  }

  return actions
}

export const executionAction = async ({ action, query, close, keep }) => {
  if (action.type === 'save-memory') {
    const match = query.match(/([a-zA-Z0-9\s_\-]+)(=?)(.*)/)
    await memoryService.add(match[1], match[3], userId)
    close()
  } else if (action.type === 'get-memory') {
    const { value } = await memoryService.getByExactKeyAndUserId(userId, query)
    clipboard.writeText(value)
  }
}
