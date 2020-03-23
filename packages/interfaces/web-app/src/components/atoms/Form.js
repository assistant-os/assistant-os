import React from 'react'
import PropTypes from 'prop-types'

const Form = ({ onSubmit, ...props }) => {
  const handleSubmit = event => {
    event.preventDefault()
    event.stopPropagation()
    onSubmit(event)
  }

  return <form {...props} onSubmit={handleSubmit} />
}

Form.defaultProps = {
  onSubmit: () => {},
}

Form.propTypes = {
  onSubmit: PropTypes.func,
}

export default Form
