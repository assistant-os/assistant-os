import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Message from 'components/organisms/Message'

import QueryBuilder from 'components/molecules/QueryBuilder'

import { getMessages } from 'redux/messages'
import { handleStage } from 'redux/os'

import style from './Discussion.module.scss'

const Discussion = ({ onNewMessage }) => {
  const messages = useSelector(getMessages)

  const ref = useRef(null)
  const dispatch = useDispatch()

  const updateScroll = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  useEffect(() => {
    console.log('useEffect')
    dispatch(handleStage())
  }, [])

  useEffect(() => {
    updateScroll()
  }, [messages])

  return (
    <div className={style.Discussion}>
      <div className={style.messages} ref={ref}>
        {messages.map((message, index) => (
          <Message message={message} key={message.id} index={index} />
        ))}
      </div>
      <div className={style.newMessage}>
        <QueryBuilder />
      </div>
    </div>
  )
}

Discussion.defaultProps = {
  onNewMessage: () => {},
}

Discussion.propTypes = {
  onNewMessage: PropTypes.func,
}

export default Discussion
