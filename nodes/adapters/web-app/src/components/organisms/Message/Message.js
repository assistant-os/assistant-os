import React from 'react'
import PropTypes from 'prop-types'

import style from './Message.module.scss'

const Message = ({ className, type, content, emitter }) => (
  <div
    className={`${style.Message} ${
      emitter === 'me' ? style.me : style.other
    } ${className}`}
  >
    <div className={style.content}>{content}</div>
  </div>
)

Message.defaultProps = {
  className: '',
  type: '',
  content: {},
  emitter: 'other',
}

Message.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  emitter: PropTypes.string,
}

export default Message
