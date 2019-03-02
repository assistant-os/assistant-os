import React from 'react'

import Input from 'components/atoms/Input'

import style from './Authentication.module.scss'

export default () => (
  <div className={style.Authentication}>
    <div>
      <Input placeholder="Token?" className={style.input} />
    </div>
  </div>
)
