// https://github.com/peter-murray/node-hue-api#discover-and-connect-to-the-hue-bridge-for-the-first-time

const { v3 } = require('node-hue-api')

const config = require('../config')

const { api: hueApi, discovery } = v3

const appName = 'Assistant-OS'
const deviceName = 'example-code'

const discoverBridgeAddress = async () => {
  console.log('discover')
  const discoveryResults = await discovery.nupnpSearch()

  console.log('result', discoveryResults)

  if (discoveryResults.length === 0) {
    throw new Error('Failed to resolve any Hue Bridges')
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return discoveryResults[0].ipaddress
  }
}

const createUser = async ipAddress => {
  try {
    const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect()

    return await unauthenticatedApi.users.createUser(appName, deviceName)
  } catch (error) {
    if (
      typeof error.getHueErrorType === 'function' &&
      error.getHueErrorType() === 101
    ) {
      throw new Error(
        'The Link button on the bridge was not pressed. Please press the Link button and try again.'
      )
    } else {
      throw error
    }
  }
}

const initialize = async () => {
  const ipAddress = await discoverBridgeAddress()

  if (!config.get('username')) {
    const { username, clientkey } = await createUser(ipAddress)
    config.set('username', username)
    config.set('clientkey', clientkey)
    console.log('create new user', username, clientkey)

    config.save()
  }

  return await hueApi.createLocal(ipAddress).connect(config.get('username'))
}

module.exports = initialize

/*
async function discoverAndCreateUser() {
  const { ipAddress } = await discoverBridge()

  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect()

  let createdUser
  try {
    createdUser = await unauthenticatedApi.users.createUser(appName, deviceName)
    console.log(
      '*******************************************************************************\n'
    )
    console.log(
      'User has been created on the Hue Bridge. The following username can be used to\n' +
        'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
        'YOU SHOULD TREAT THIS LIKE A PASSWORD\n'
    )
    console.log(`Hue Bridge User: ${createdUser.username}`)
    console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`)
    console.log(
      '*******************************************************************************\n'
    )

    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi
      .createLocal(ipAddress)
      .connect(createdUser.username)

    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.getConfiguration()
    console.log(
      `Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`
    )
  } catch (err) {
    if (err.getHueErrorType() === 101) {
      console.error(
        'The Link button on the bridge was not pressed. Please press the Link button and try again.'
      )
    } else {
      console.error(`Unexpected Error: ${err.message}`)
    }
  }
}

// Invoke the discovery and create user code
// discoverAndCreateUser()
*/
