import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

import DetailsTimelog from '@/components/molecules/DetailsTimelog'
import DetailsCompany from '@/components/molecules/DetailsCompany'
import Icon from '@/components/atoms/Icon'
import loaderIcon from '@/assets/loader'

import style from './Details.style'

const components = {
  timelog: DetailsTimelog,
  companies: DetailsCompany,
}

const LoadingComponent = () => (
  <div className={style.loaderContainer}>
    <Icon className={style.loader} src={loaderIcon} />
  </div>
)

const defaultComponent = () => null

export default ({ className, action }) => {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    setDetails(null)
    ipcRenderer.send('get-data', { action, request: { type: action.detail } })
  }, [action.id])

  useEffect(() => {
    ipcRenderer.on('set-data', (event, { data, action: processedAction }) => {
      if (action.id === processedAction.id) {
        setDetails(data)
        console.log('details', data)
      }
    })
    ipcRenderer.send('get-data', { action, request: { type: action.detail } })
  }, [])

  const Component =
    action.detail && !details
      ? LoadingComponent
      : components[action.section] || defaultComponent

  return (
    <div className={`${className} ${style.Details}`}>
      <Component action={action} details={details} />
    </div>
  )
}
