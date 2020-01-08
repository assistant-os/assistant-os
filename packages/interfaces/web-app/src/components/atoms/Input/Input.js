import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import style from './Input.module.scss'

const Input = ({ onChange, className, forceFocus, ...props }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (forceFocus) {
      ref.current.focus()
    }
  })

  return (
    <input
      ref={ref}
      type="text"
      className={`${style.Input} ${className}`}
      {...props}
      onChange={event => onChange(event.target.value, event)}
    />
  )
}

Input.defaultProps = {
  className: '',
  onChange: () => {},
  forceFocus: false,
}

Input.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  forceFocus: PropTypes.bool,
}

export default Input
