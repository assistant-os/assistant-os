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
      resolve({ format: 'text', content: '' })
    })
  }

  setValue ({ messageId, id, value }) {}

  start () {
    super.start()

    this.on('data', ({ type, payload }) => {
      if (type === 'ask-probability') {
        const { messageId } = payload
        this.evaluateProbability(payload).then(probability => {
          this.send('answer-probability', {
            probability,
            messageId,
          })
        })
      } else if (type === 'ask-answer') {
        const { messageId } = payload
        this.answer(payload).then(answer => {
          this.send('answer-answer', {
            ...answer,
            messageId,
          })
        })
      } else if (type === 'set-value') {
        this.setValue(payload)
      }
    })
  }
}
