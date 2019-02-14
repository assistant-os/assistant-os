import WebSocketNode from 'nodes/libs/websocket-node'

import 'config/env'

export default class extends WebSocketNode {
  constructor () {
    super({
      token: process.env.TOKEN,
      host: process.env.HOST,
      port: process.env.PORT,
      label: 'hello',
      priority: 5,
      type: 'module'
    })
  }
}
