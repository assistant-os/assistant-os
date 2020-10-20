let lastTime = new Date().getTime()

const onResumeFromSleep = callback => {
  setInterval(function() {
    const currentTime = new Date().getTime()
    if (currentTime > lastTime + 2000 * 2) {
      callback()
    }
    lastTime = currentTime
  }, 2000)
}

module.exports = {
  onResumeFromSleep,
}
