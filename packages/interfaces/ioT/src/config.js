const path = require('path')
const nconf = require('nconf')

const configFilename = path.join(__dirname, '../config.json')

// nconf.file({
//   file: configFilename,
//   secure: {
//     secret: '3d4bd48b003a00faad00e6cf17814e1c729ca7ec',
//     alg: 'aes-256-ctr',
//   },
// })

nconf.file(configFilename)

module.exports = nconf
