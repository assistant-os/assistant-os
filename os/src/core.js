import EventEmitter from 'events'

/**
 * The Core
 */
export default class Core extends EventEmitter {
  constructor ({
    name = 'Assistant',
    timeout = 15000 /* maximum accepted delay for a response by modules */,
  } = {}) {
    super()
    this.timeout = timeout
    this.nodes = []
    this.identity = {
      name,
    }
    this.context = {}

    this.waitingForProbability = null
  }

  chooseAnswer (messageId) {
    if (this.waitingForProbability) {
      clearTimeout(this.waitingForProbability)
      this.waitingForProbability = null
    }
    const { answers, payload } = this.context[messageId]
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
        payload: { ...payload, messageId },
      })
    } else if (messageId in this.context) {
      this.emit('node', {
        type: 'answer-answer',
        id: this.context[messageId].adapter,
        payload: {
          format: 'text',
          content: 'Sorry I didn\'t understand your message.',
        },
      })
    }
  }

  processAdapterMessage ({ id, type, payload }) {
    if (type === 'message') {
      // process the message

      // we generate an id to identify the message
      const messageId = Math.floor(Math.random() * Math.floor(1000000))

      // we ask to all modules their probability for a response
      this.emit('node', {
        type: 'ask-probability',
        group: 'module',
        payload: {
          ...payload,
          messageId,
        },
      })
      this.emit('info', `new message "${payload.content}"`)
      // we store the information in the context
      this.context[messageId] = {
        adapter: id,
        payload,
        answers: {},
      }

      this.waitingForProbability = setTimeout(() => {
        // if no modules are available or if at least one module take too long time to respond.
        this.emit('info', 'probability timeout')
        this.chooseAnswer(messageId)
      }, this.timeout)
    } else if (type === 'set-value') {
      const messageId = Math.floor(Math.random() * Math.floor(1000000))
      // we store the information in the context
      this.context[messageId] = {
        adapter: id,
      }

      this.emit('info', `set value ${payload.id} ${payload.value}`)

      this.emit('node', {
        type: 'set-value',
        group: 'module',
        payload: {
          ...payload,
          messageId,
        },
      })
    }
  }

  processModuleMessage ({ id, type, payload }, fromNode) {
    if (type === 'answer-probability' && payload.messageId in this.context) {
      // process the probability response from one module
      const context = this.context[payload.messageId]
      context.answers[id] = {
        probability: payload.probability,
      }
      this.emit(
        'info',
        `probability "${payload.probability}" by ${fromNode.label}`
      )

      const answersNumber = Object.keys(context.answers).length
      const modulesNumber = this.nodes.filter(node => node.type === 'module')
        .length

      // if all modules have responded
      if (answersNumber === modulesNumber) {
        this.chooseAnswer(payload.messageId)
      }
    } else if (type === 'answer-answer' && payload.messageId in this.context) {
      // process the content response from one module
      this.emit(
        'info',
        `module ${id} with type ${type} answered "${payload.content}"`
      )
      this.emit('node', {
        type: 'answer-answer',
        id: this.context[payload.messageId].adapter,
        payload,
      })
    } else if (type === 'set-value') {
    }
  }

  processMessage ({ id, type, payload }) {
    if (type === 'register') {
      // register the node
      const { type, label } = payload
      this.nodes.push({ id, ...payload })
      this.emit('info', `${type} ${label} registered`)
      this.emit('node', {
        type: 'registered',
        id,
        payload: { name: this.identity.name },
      })

      return
    }

    const index = this.nodes.findIndex(node => node.id === id)
    const node = this.nodes[index]

    if (!node) {
      return
    }

    if (type === 'unregister') {
      // unregister the node
      const { type } = this.nodes[index]
      this.nodes.splice(index, 1)
      this.emit('info', `${type} ${id} unregistered`)
    } else if (node.type === 'module') {
      this.processModuleMessage({ id, type, payload }, node)
    } else if (node.type === 'adapter') {
      this.processAdapterMessage({ id, type, payload }, node)
    }
  }

  start () {
    this.emit('info', `${this.identity.name} started`)
  }
}
