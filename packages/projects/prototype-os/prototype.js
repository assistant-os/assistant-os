import { logger, config } from '@assistant-os/common'
// import spotify from '@assistant-os/adapter-spotify'
import netatmo from '@assistant-os/adapter-netatmo'

const start = async () => {
  await config.start()
  await logger.start()
  await netatmo.start()

  logger.info('prototype ready')

  const { home } = await netatmo.homeInfo()

  logger.info('home', {
    name: home.name,
    people: home.persons
      .filter(p => p.pseudo)
      .map(p => ({ pseudo: p.pseudo, outOfSight: p.out_of_sight })),
    cameras: home.cameras.length,
  })

  // try {
  //   await spotify.execute('spotify devices')
  // } catch (error) {
  //   logger.error('error', { error })
  // }
}

export default { start }
