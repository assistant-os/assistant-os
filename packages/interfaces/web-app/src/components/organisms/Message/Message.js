import React from 'react'
import PropTypes from 'prop-types'

import TextMessage from 'components/atoms/TextMessage'
import ListMessage from 'components/atoms/ListMessage'

import style from './Message.module.scss'

const Message = ({ className, message, index }) => {
  const { text } = message

  const Component = text ? TextMessage : ListMessage

  return (
    <div className={`${style.Message} ${className}`}>
      <Component className={style.content} {...message} index={index} />
    </div>
  )
}

Message.defaultProps = {
  className: '',
  message: null,
  index: 0,
}

Message.propTypes = {
  className: PropTypes.string,
  message: PropTypes.shape({
    emitter: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    format: PropTypes.string,
  }),
  index: PropTypes.number,
}

export default Message
