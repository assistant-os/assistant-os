import React from 'react'

import DetailsTimelog from '@/components/molecules/DetailsTimelog'

import style from './Details.style'

const when = (action, type, node) =>
  action && action.type === type ? node : null

export default ({ className, action }) => (
  <div className={`${className} ${style.Details}`}>
    {when(action, 'start-project', <DetailsTimelog action={action} />)}
    {when(action, 'stop-project', <DetailsTimelog action={action} />)}
  </div>
)
