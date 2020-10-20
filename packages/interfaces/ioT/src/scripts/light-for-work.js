const { onResumeFromSleep } = require('../computer/sleep')
const { light } = require('../hue/light')
const { isDockConnected } = require('../computer/usb')

const lightIfConnected = async () => {
  // const today = new Date()
  // const hour = today.getHours()

  // if (hour > 18) {
  //   return
  // }

  const connected = await isDockConnected()

  console.log('lightIfConnected', connected)

  if (connected) {
    await light()
  }
}

onResumeFromSleep(lightIfConnected)

setInterval(lightIfConnected, 2000)
