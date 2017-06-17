import Middleware from '../../os/middleware'

import music from './music'
import nodes from './nodes'
import presence from './presence'

const context = new Middleware()

context.use(music)
context.use(nodes)
context.use(presence)

export default context

// export let music
// export let nodes
// export let presence
