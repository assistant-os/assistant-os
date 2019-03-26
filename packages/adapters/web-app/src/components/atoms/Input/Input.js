import React, { Component } from 'react'
import PropTypes from 'prop-types'

import style from './Input.module.scss'

class Input extends Component {
  focus () {
    if (this.input) {
      this.input.focus()
    }
  }

  render () {
    const { className, placeholder, onChange, value, onFocus } = this.props
    return (
      <input
        ref={e => (this.input = e)}
        type="text"
        className={`${style.Input} ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        onFocus={onFocus}
      />
    )
  }
}

Input.defaultProps = {
  className: '',
  placeholder: '',
  onChange: () => {},
  value: '',
  onFocus: () => {},
}

Input.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  onFocus: PropTypes.func,
}

export default Input
