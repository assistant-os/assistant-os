import React from 'react'
import PropTypes from 'prop-types'

import style from './TextMessage.module.scss'

const TextMessage = ({ className, content, emitter }) => (
  <div
    className={`${style.TextMessage} ${
      emitter === 'me' ? style.me : style.other
    } ${className}`}
  >
    <div className={style.content}>{content}</div>
  </div>
)

TextMessage.defaultProps = {
  className: '',
  content: {},
  emitter: 'other',
}

TextMessage.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  emitter: PropTypes.string,
}

export default TextMessage
