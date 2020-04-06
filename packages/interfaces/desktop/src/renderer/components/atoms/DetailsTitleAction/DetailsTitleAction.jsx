import React from 'react'
import { shell } from 'electron'

import Icon from '@/components/atoms/Icon'

import style from './DetailsTitleAction.style'

export default ({ icon, href, title }) => {
  const onClick = () => shell.openExternal(href)

  return (
    <button className={style.button} onClick={onClick} title={title}>
      <Icon className={style.icon} src={icon} />
    </button>
  )
}
