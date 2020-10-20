import path from 'path'

import gherkin from 'gherkin'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@assistant-os/common'

let scenarios = []

const start = () =>
  new Promise(resolve => {
    const scenarioFilename = path.join(
      __dirname,
      '../__features__/test.feature'
    )

    // const stream = fs.createReadStream(scenarioFilename)

    const stream = gherkin.fromPaths([scenarioFilename])

    let data = []

    stream
      .on('data', function(chunk) {
        data.push(chunk)
      })
      .on('end', function() {
        data[1].gherkinDocument.feature.children.forEach(child => {
          if (child.scenario) {
            scenarios.push({
              id: uuidv4(),
              when: child.scenario.steps.find(s => s.keyword === 'When ').text,
              then: child.scenario.steps.find(s => s.keyword === 'Then ').text,
              enabled: true,
            })
          }
        })

        // logger.info('scenarios', { scenarios })

        resolve()
      })
  })

export const getAll = () => scenarios

export const findOneWhen = when => {
  const authorizedScenarios = scenarios
    .filter(scenario => scenario.enabled)
    .filter(scenario => scenario.when === when)

  return authorizedScenarios.length > 0 ? authorizedScenarios[0] : null
}

export const setEnable = (id, enabled) => {
  const index = scenarios.findIndex(s => s.id === id)

  scenarios[index].enabled = enabled
}

export default { start, findOneWhen, getAll, setEnable }
