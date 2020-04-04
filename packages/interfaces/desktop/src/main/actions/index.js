import * as projects from './projects'
import * as timelog from './timelog'
import * as memory from './memory'
import * as companies from './companies'

export const init = async () => {
  await projects.init()
  await timelog.init()
  await memory.init()
  return await companies.init()
}

export default { timelog, memory, projects, companies }
