import React from 'react'

import Icon from '@/components/atoms/Icon'

import icons from '@/assets/icons'

import style from './ListItem.style'

export default ({ className, active, children, onClick, help, icon }) => (
  <button
    className={`${style.ListItem} ${active ? style.active : ''}  ${className}`}
    onClick={onClick}
  >
    <Icon src={icons[icon]} className={style.icon} />
    <span className={style.label}>{children}</span>{' '}
    {help ? <span className={style.help}>― {help}</span> : null}
  </button>
)
