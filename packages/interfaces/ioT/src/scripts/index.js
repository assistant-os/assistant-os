const GroupLightState = require('node-hue-api').v3.lightStates.GroupLightState

const initialize = require('../hue/initialize')

let api = null
let stimulation = null
let salon = null

initialize()
  .then(newApi => {
    api = newApi
    return newApi
  })
  .then(api => api.configuration.getConfiguration())
  .then(bridgeConfig => {
    console.log(
      `Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`
    )
  })
  .then(() => api.scenes.getSceneByName('Stimulation'))
  .then(results => {
    // Do something with the scenes we found
    results.forEach(scene => {
      // console.log(scene.toStringDetailed())
      stimulation = scene
    })
  })
  .then(() => api.groups.getGroupByName('Salon'))
  .then(matchedGroups => {
    matchedGroups.forEach(group => {
      // console.log(group.toStringDetailed())
      salon = group
    })
  })
  .then(() => {
    const mySceneLightState = new GroupLightState()
      .scene(stimulation.id)
      .on()
      .brightness(100)

    return api.groups.setGroupState(salon.id, mySceneLightState)
  })
  .then(result => {
    console.log(`Activated Scene? ${result}`)
  })
  .catch(error => {
    console.error(error)
  })
