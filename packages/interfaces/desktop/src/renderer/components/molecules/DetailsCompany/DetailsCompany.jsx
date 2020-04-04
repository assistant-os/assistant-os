import React, { useState, useEffect, useRef } from 'react'
import { format, differenceInSeconds } from 'date-fns'
import { ipcRenderer, shell } from 'electron'

import AutoCopy from '@/components/atoms/AutoCopy'
import DetailsTitle from '@/components/atoms/DetailsTitle'
import Icon from '@/components/atoms/Icon'
import mapsIcon from '@/assets/pin'
import style from './DetailsCompany.style'

const toFirstLetterUpperCase = s => {
  if (typeof s !== 'string') {
    return s
  }

  return s
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ')
}

export default ({ action, details }) => {
  if (!details) {
    return null
  }

  const onGoogleMapClick = () => {
    console.log('onClick')
    shell.openExternal(
      `https://maps.google.com/?q=${encodeURI(details.address)}`
    )
  }

  return (
    <div className={style.Company}>
      <DetailsTitle>{toFirstLetterUpperCase(details.name)}</DetailsTitle>
      <div className={style.timing}>
        <div className={style.line}>
          <span className={style.label}>Address:</span>
          <span className={style.value}>
            <AutoCopy>
              {toFirstLetterUpperCase(details.address)} mdfkm fld;sk fkdls;
              kflds;k
            </AutoCopy>
          </span>

          {/*<button className={style.pinButton} onClick={onGoogleMapClick}>
            <Icon className={style.pin} src={mapsIcon} />
          </button>*/}
        </div>
        <div className={style.line}>
          <span className={style.label}>Creation date:</span>
          <span className={style.value}>
            <AutoCopy>{details.createdAt}</AutoCopy>
          </span>
        </div>
        {details.legal &&
          Object.keys(details.legal).map(key => (
            <div className={style.line} key={key}>
              <span className={style.label}>{key}:</span>
              <span className={style.value}>
                <AutoCopy>{details.legal[key]}</AutoCopy>
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
