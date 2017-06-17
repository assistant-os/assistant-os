import Middleware from '../../os/middleware'

import scheduler from './scheduler'
import wakeUp from './wake-up'

let eventManager = new Middleware('event')

eventManager.use(scheduler)
eventManager.use(wakeUp)

export default eventManager

// export let scheduler
// export let wakeUp
