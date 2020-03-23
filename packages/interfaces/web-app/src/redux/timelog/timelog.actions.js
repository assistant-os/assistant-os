export const START_PROJECT = 'START_PROJECT'

export const startProject = (id, name) => ({
  type: START_PROJECT,
  payload: { id, name, startedAt: new Date() },
})

export const STOP_PROJECT = 'STOP_PROJECT'
export const stopProject = id => ({
  type: STOP_PROJECT,
  payload: { id, stoppedAt: new Date() },
})
