import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Input from 'components/atoms/Input'
import Message from 'components/organisms/Message'

import { ReactComponent as Send } from 'assets/send.svg'

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
  }

  componentDidMount () {
    this.handleFocus()
    this.props.connect()

    if (this.input) {
      this.input.focus()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { messages } = this.props
    if (prevProps.messages.length !== messages.length) {
      this.updateScroll()
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
      const { sendMessage } = this.props
      sendMessage('text', query)
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
            {messages.map(({ date, emitter, content, format }, index) => (
              <Message
                index={index}
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
  messages: [],
  clearMemory: () => {},
  connect: () => {},
  sendMessage: () => {},
  isStarted: false,
}

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
      emitter: PropTypes.string,
      type: PropTypes.string,
      date: PropTypes.number,
    })
  ),
  connect: PropTypes.func,
  sendMessage: PropTypes.func,
  isStarted: PropTypes.bool,
}

export default Chat
