import Middleware from '../../os/middleware'
import state from '../../os/state'

let nodes = new Middleware('nodes')

nodes.hear('list nodes', (req, res) => {
  for (const node of nodes.getNexus().nodes) {
    res.reply(`${node.name} [${node.real_name}]: ${node.isConnected() ? 'connected' : 'disconnected'}`)
  }
})

export default nodes
