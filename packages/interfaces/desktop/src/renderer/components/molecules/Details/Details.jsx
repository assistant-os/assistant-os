import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

import DetailsTimelog from '@/components/molecules/DetailsTimelog'
import DetailsCompany from '@/components/molecules/DetailsCompany'

import style from './Details.style'

const components = {
  timelog: DetailsTimelog,
  companies: DetailsCompany,
}

const defaultComponent = () => null

export default ({ className, action }) => {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    setDetails(null)
    ipcRenderer.send('get-data', { action, request: { type: action.detail } })
  }, [action.id])

  useEffect(() => {
    ipcRenderer.on('set-data', (event, data) => setDetails(data))
    ipcRenderer.send('get-data', { action, request: { type: action.detail } })
  }, [])

  const Component = components[action.section] || defaultComponent

  return (
    <div className={`${className} ${style.Details}`}>
      <Component action={action} details={details} />
    </div>
  )
}
