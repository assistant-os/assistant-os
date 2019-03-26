import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Heart } from 'assets/heart.svg'
import { ReactComponent as HeartOutline } from 'assets/heart-outline.svg'

import style from './Action.module.scss'

const Action = ({ className, icon, value, onChange }) => {
  const component = { component: null }

  if (icon === 'favorite') {
    if (value) {
      component.component = Heart
    } else {
      component.component = HeartOutline
    }
  }

  if (component.component === null) {
    return null
  }

  return (
    <button
      type="button"
      className={style.button}
      onClick={() => {
        onChange(!value)
      }}
    >
      <component.component className={`${style.Action} ${className}`} />
    </button>
  )
}

Action.defaultProps = {
  className: '',
  icon: '',
  type: '',
  id: '',
  value: null,
  onChange: () => {},
}

Action.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
}

export default Action
