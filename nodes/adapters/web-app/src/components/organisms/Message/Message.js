import React from 'react'
import PropTypes from 'prop-types'

import style from './Message.module.scss'

const Message = ({ className, format, content, emitter }) => (
  <div
    className={`${style.Message} ${
      emitter === 'me' ? style.me : style.other
    } ${className}`}
  >
    {format === 'text' ? <div className={style.content}>{content}</div> : null}
  </div>
)

Message.defaultProps = {
  className: '',
  format: '',
  content: {},
  emitter: 'other',
}

Message.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  emitter: PropTypes.string,
}

export default Message
