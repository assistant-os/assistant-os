import WebSocketNode from './websocket-node'

export default class Adapter extends WebSocketNode {
  constructor (props) {
    super({
      ...props,
      type: 'adapter',
    })
  }
}
