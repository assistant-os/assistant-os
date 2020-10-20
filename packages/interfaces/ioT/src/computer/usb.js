const { exec } = require('child_process')

// const usb = require('usb')

// console.log('usb.getDeviceList()', usb.getDeviceList())

const dockName = 'StartTech DK30CH2DEP'

const isDockConnected = () =>
  new Promise((resolve, reject) => {
    exec('system_profiler SPUSBDataType', (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout.includes(dockName))
      }
    })
  })

module.exports = {
  isDockConnected,
}
