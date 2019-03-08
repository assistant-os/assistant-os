import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Input from 'components/atoms/Input'
import Message from 'components/organisms/Message'
import { ReactComponent as Send } from 'assets/send.svg'

import Os from 'os/os'

import style from './Chat.module.scss'

class Chat extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.updateScroll = this.updateScroll.bind(this)

    this.state = {
      query: '',
    }

    const {
      addMessage,
      setToken,
      setHost,
      host,
      token,
      connect,
      clearMemory,
    } = this.props

    // const clearMemory = () => {
    //   console.log('clearMemory')
    //
    //   persistor.pause()
    //   persistor.purge().then(() => {
    //     console.log('purged')
    //     // window.location.reload()
    //   })
    // }

    this.os = new Os(host, token, {
      addMessage,
      setToken,
      setHost,
      clearMemory,
      connect,
    })
  }

  componentDidMount () {
    this.os.start()
    this.handleFocus()
  }

  componentDidUpdate (prevProps, prevState) {
    const { messages, token, host } = this.props
    if (prevProps.messages.length !== messages.length) {
      this.updateScroll()
    }

    if (prevProps.token !== token) {
      this.os.setToken(token)
    }

    if (prevProps.host !== host) {
      this.os.setHost(host)
    }
  }

  handleFocus () {
    setTimeout(() => {
      this.updateScroll()
    }, 200)
  }

  handleChange (event) {
    this.setState({
      query: event.target.value,
    })
  }

  updateScroll () {
    if (this.discussion) {
      this.discussion.scrollTop = this.discussion.scrollHeight
    }
  }

  handleSubmit (event) {
    const { query } = this.state
    if (this.input) {
      this.input.focus()
    }
    if (query) {
      const { sendMessage, token } = this.props
      sendMessage(token, 'text', query)

      this.os.reactToMessage(query)
      this.setState({
        query: '',
      })
    }

    event.preventDefault()
    event.stopPropagation()
  }

  render () {
    const { query } = this.state
    const { messages } = this.props
    return (
      <div className={style.Chat}>
        <div className={style.discussion} ref={e => (this.discussion = e)}>
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={300}
          >
            {messages.map(({ date, emitter, content, format }) => (
              <Message
                key={date}
                emitter={emitter}
                content={content}
                format={format}
              />
            ))}
          </ReactCSSTransitionGroup>
        </div>
        <div className={style.newMessage}>
          <form className={style.form} onSubmit={this.handleSubmit}>
            <Input
              ref={e => (this.input = e)}
              value={query}
              className={style.input}
              placeholder="New message"
              onChange={this.handleChange}
              onFocus={this.handleFocus}
            />
            {query !== '' ? (
              <button
                type="button"
                className={style.submit}
                onClick={this.handleSubmit}
              >
                <Send className={style.icon} />
              </button>
            ) : null}
          </form>
        </div>
      </div>
    )
  }
}

Chat.defaultProps = {
  token: '',
  host: '',
  messages: [],
  addMessage: () => {},
  setToken: () => {},
  setHost: () => {},
  clearMemory: () => {},
  connect: () => {},
  sendMessage: () => {},
}

Chat.propTypes = {
  token: PropTypes.string,
  host: PropTypes.string,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
      emitter: PropTypes.string,
      type: PropTypes.string,
      date: PropTypes.number,
    })
  ),
  addMessage: PropTypes.func,
  setToken: PropTypes.func,
  setHost: PropTypes.func,
  clearMemory: PropTypes.func,
  connect: PropTypes.func,
  sendMessage: PropTypes.func,
}

export default Chat
