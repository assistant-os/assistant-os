export default class Os {
  constructor (
    host = null,
    token = null,
    {
      addMessage = () => {},
      setToken = () => {},
      setHost = () => {},
      clearMemory = () => {},
      connect = () => {},
    } = {}
  ) {
    this.askToAddMessage = addMessage
    this.askToSetToken = setToken
    this.askToSetHost = setHost
    this.askToClearMemory = clearMemory
    this.askToConnect = connect
    this.token = token
    this.host = host

    this.context = {}
  }

  reactToMessage (message) {
    if (message.toLowerCase() === 'clear') {
      this.askToAddMessage('other', 'Do you really want to clear my memory?')
      this.context = { type: 'confirmClear' }
    } else if (
      message.toLowerCase() === 'yes' &&
      this.context &&
      this.context.type === 'confirmClear'
    ) {
      this.askToAddMessage('other', 'Ok. Clearing memory.')

      setTimeout(() => {
        this.askToClearMemory()
      }, 2000)
    } else if (!this.host) {
      if (message.match(/http(s|):\/\/[A-Za-z0-9.\-_:/]+/)) {
        this.askToSetHost(message)
      } else {
        this.askToAddMessage('other', 'Please provide a valid url.')
      }
    } else if (!this.token) {
      if (message.match(/[A-Za-z0-9]+/)) {
        this.askToSetToken(message)
      } else {
        this.askToAddMessage('other', 'Please provide a valid token.')
      }
    }
  }

  setToken (token) {
    this.token = token
    this.react()
  }

  setHost (host) {
    this.host = host
    this.react()
  }

  react () {
    setTimeout(() => {
      if (!this.host) {
        this.askToAddMessage(
          'other',
          'In order to connect, I need to have the url of your assistant.',
          'text'
        )
      } else if (!this.token) {
        this.askToAddMessage(
          'other',
          'I need a token to be authorized by your assistant.',
          'text'
        )
        this.context = { type: 'afterToken' }
      } else if (this.context && this.context.type === 'afterToken') {
        this.askToAddMessage(
          'other',
          'Ok thank you. I try to establish the connection.',
          'text'
        )
        this.connect()
      }
    }, 1500)
  }

  connect () {
    if (this.host && this.token) {
      this.askToConnect(this.host, this.token)
    }
  }

  start () {
    this.react()
    this.connect()
  }
}
