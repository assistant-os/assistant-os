import EventEmitter from 'events'

/**
 * The Core
 */
export default class Core extends EventEmitter {
  constructor ({ name = 'Assistant' }) {
    super()
    this.nodes = []
    this.identity = {
      name,
    }
    this.context = {}
  }

  chooseAnswer (messageId) {
    const { answers, content } = this.context[messageId]
    let betterAnswer = { probability: -1 }
    let betterAdapterId = null
    Object.keys(answers).forEach(adapterId => {
      const currentAnswer = answers[adapterId]
      if (
        currentAnswer.probability > betterAnswer.probability &&
        currentAnswer.probability > 0.5
      ) {
        betterAdapterId = adapterId
        betterAnswer = currentAnswer
      }
    })

    if (betterAdapterId && betterAnswer.probability > -1) {
      this.emit('node', {
        type: 'ask-answer',
        id: betterAdapterId,
        payload: { content, messageId },
      })
    } else if (messageId in this.context) {
      this.emit('node', {
        type: 'answer-answer',
        id: this.context[messageId].adapter,
        payload: { content: { type: 'nothing' } },
      })
    }
  }

  processMessage ({ id, type, payload }) {
    if (type === 'register') {
      const { type, label } = payload
      this.nodes.push({ id, ...payload })
      this.emit('info', `${type} ${label} registered`)
      this.emit('node', { type: 'registered', id })
    } else if (type === 'unregister') {
      const index = this.nodes.findIndex(node => node.id === id)
      const { type } = this.nodes[index]
      this.nodes.splice(index, 1)
      this.emit('info', `${type} ${id} unregistered`)
    } else if (type === 'message') {
      const messageId = Math.floor(Math.random() * Math.floor(1000000))

      this.emit('node', {
        type: 'ask-probability',
        group: 'module',
        payload: {
          ...payload,
          messageId,
        },
      })
      this.emit('info', `new message "${payload.content}"`)
      this.context[messageId] = {
        adapter: id,
        content: payload.content,
        answers: {},
      }
    } else if (type === 'answer-probability') {
      if (payload.messageId in this.context) {
        const context = this.context[payload.messageId]
        context.answers[id] = {
          probability: payload.probability,
        }
        const node = this.nodes.find(node => node.id === id)
        this.emit(
          'info',
          `probability "${payload.probability}" by ${node.label}`
        )

        const answersNumber = Object.keys(context.answers).length
        const modulesNumber = this.nodes.filter(node => node.type === 'module')
          .length

        if (answersNumber === modulesNumber) {
          this.chooseAnswer(payload.messageId)
        }
      }
    } else if (type === 'answer-answer') {
      if (payload.messageId in this.context) {
        this.emit(
          'info',
          `module ${id} with type ${type} answered "${payload.content}"`
        )
        this.emit('node', {
          type: 'answer-answer',
          id: this.context[payload.messageId].adapter,
          payload: { content: payload.content },
        })
      }
    }
  }

  start () {
    this.emit('info', `${this.identity.name} started`)
  }
}
