import React from 'react'
import PropTypes from 'prop-types'

import TextMessage from 'components/molecules/TextMessage'
import ListMessage from 'components/molecules/ListMessage'

import style from './Message.module.scss'

const Message = ({ className, format, content, emitter, index }) => {
  let component = { component: null }
  if (format === 'text') {
    component.component = TextMessage
  } else if (format === 'list') {
    component.component = ListMessage
  }

  if (component.component === null) {
    return null
  }

  return (
    <div className={`${style.Message} ${className}`}>
      <component.component
        className={style.content}
        content={content}
        emitter={emitter}
        index={index}
      />
    </div>
  )
}

Message.defaultProps = {
  className: '',
  format: '',
  content: {},
  emitter: 'other',
  index: '',
}

Message.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  emitter: PropTypes.string,
  index: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
}

export default Message
