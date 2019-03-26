import React from 'react'
import PropTypes from 'prop-types'

import style from './Button.module.scss'

const Button = ({ className, onClick, title, children }) => (
  <button
    className={`${style.Button} ${className}`}
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
)

Button.defaultProps = {
  className: '',
  onClick: () => {},
  children: [],
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default Button
