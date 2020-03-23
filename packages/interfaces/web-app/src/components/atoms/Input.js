import React from 'react'
import PropTypes from 'prop-types'

const Input = React.forwardRef(({ onChange, forceFocus, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      {...props}
      onChange={event => onChange(event.target.value, event)}
    />
  )
})

Input.defaultProps = {
  onChange: () => {},
}

Input.propTypes = {
  onChange: PropTypes.func,
}

export default Input
