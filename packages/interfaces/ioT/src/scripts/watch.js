const { onResumeFromSleep } = require('../computer/sleep')

onResumeFromSleep(() => {
  console.log('from resume')
})
