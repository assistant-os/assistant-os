import * as projects from './projects'
import * as timelog from './timelog'
import * as memory from './memory'

export const init = async () => {
  await projects.init()
  await timelog.init()
  return await memory.init()
}

export default { timelog, memory, projects }
