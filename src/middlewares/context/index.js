import Middleware from '../../os/middleware'

import music from './music'
import nodes from './nodes'
import location from './location'
import weather from './weather'

const context = new Middleware('context')

context.use(music)
context.use(nodes)
context.use(location)
context.use(weather)

export default context

// export let music
// export let nodes
// export let presence
