import WebSocketNode from './websocket-node'

export default class Module extends WebSocketNode {
  constructor (props) {
    super({
      ...props,
      type: 'module',
    })
  }

  evaluateProbability () {
    return new Promise(resolve => {
      resolve(0)
    })
  }

  answer () {
    return new Promise(resolve => {
      resolve('')
    })
  }

  start () {
    super.start()

    this.on('message', ({ type, payload }) => {
      if (type === 'ask-probability') {
        const { content, user } = payload
        this.evaluateProbability(content, user).then(probability => {
          this.send('answer-probability', {
            probability,
            messageId: payload.messageId,
          })
        })
      } else if (type === 'ask-answer') {
        const { content, user } = payload
        this.answer(content, user).then(answer => {
          this.send('answer-answer', {
            content: answer,
            messageId: payload.messageId,
          })
        })
      }
    })
  }
}
