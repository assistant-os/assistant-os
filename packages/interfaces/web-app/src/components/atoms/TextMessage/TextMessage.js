import React from 'react'
import PropTypes from 'prop-types'

import style from './TextMessage.module.scss'

const TextMessage = ({ className, text, emitter }) => (
  <div className={`${style.TextMessage} ${style[emitter]} ${className}`}>
    <div className={`${style.bubble} ${style[emitter]}`}>{text}</div>
  </div>
)

TextMessage.defaultProps = {
  className: '',
  text: '',
  emitter: 'other',
}

TextMessage.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  emitter: PropTypes.string,
}

export default TextMessage
