import path from 'path'
import nconf from 'nconf'
import dotenv from 'dotenv'

// nconf.file({
//   file: configFilename,
//   secure: {
//     secret: '3d4bd48b003a00faad00e6cf17814e1c729ca7ec',
//     alg: 'aes-256-ctr',
//   },
// })

nconf.start = async () => {
  dotenv.config()

  const configFilename = path.join(__dirname, '../../../../config.json')

  nconf.env().file(configFilename)
}

export default nconf
