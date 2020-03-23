import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import style from './Spotlight.module.scss'

const Spotlight = ({ onSubmit, onChange, onKeyDown, value }) => {
  const ref = useRef()

  useEffect(() => {
    ref.current.focus()
  }, [])

  const handleSubmit = event => {
    onSubmit()
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <form className={style.Spotlight} onSubmit={handleSubmit}>
      <input
        className={style.input}
        placeholder="On which project are you working?"
        onChange={event => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        value={value}
        ref={ref}
      />
    </form>
  )
}

Spotlight.defaultProps = {
  onSubmit: () => {},
  onChange: () => {},
  onKeyDown: () => {},
  value: null,
}

Spotlight.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default Spotlight
