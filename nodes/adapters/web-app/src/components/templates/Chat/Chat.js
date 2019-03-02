import React, { Component } from 'react'

import Input from 'components/atoms/Input'
import { ReactComponent as Send } from 'assets/send.svg'

import style from './Chat.module.scss'

class Chat extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      messages: [
        {
          content: 'Hello',
          emitter: 'me',
        },
        {
          content: 'Hello',
          emitter: 'other',
        },
        {
          content: 'Hello',
          emitter: 'me',
        },
        {
          content: 'Hello',
          emitter: 'other',
        },
        {
          content: 'Hello',
          emitter: 'me',
        },
        {
          content: 'Hello',
          emitter: 'other',
        },
      ],
      query: '',
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { messages } = this.state
    if (prevState.messages.length !== messages.length) {
      this.updateScroll()
    }
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
    const { messages, query } = this.state
    if (this.input) {
      this.input.focus()
    }
    this.setState({
      messages: [
        ...messages,
        {
          content: query,
          emitter: 'me',
        },
      ],
      query: '',
    })

    event.preventDefault()
    event.stopPropagation()
  }

  renderMessage ({ emitter, content }) {
    return (
      <div
        className={`${style.message} ${
          emitter === 'me' ? style.me : style.other
        }`}
      >
        <div className={style.content}>{content}</div>
      </div>
    )
  }

  render () {
    const { query, messages } = this.state
    return (
      <div className={style.Chat}>
        <div className={style.discussion} ref={el => (this.discussion = el)}>
          {messages.map(message => this.renderMessage(message))}
        </div>
        <div className={style.newMessage}>
          <form class={style.form} onSubmit={this.handleSubmit}>
            <Input
              ref={e => (this.input = e)}
              value={query}
              className={style.input}
              placeholder="New message"
              onChange={this.handleChange}
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

export default Chat
