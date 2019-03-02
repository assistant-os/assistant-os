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
    const { className, placeholder, onChange, value } = this.props
    return (
      <input
        ref={e => (this.input = e)}
        type="text"
        className={`${style.Input} ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    )
  }
}

Input.defaultProps = {
  className: '',
  placeholder: '',
  onChange: () => {},
  value: '',
}

Input.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.func,
}

export default Input
