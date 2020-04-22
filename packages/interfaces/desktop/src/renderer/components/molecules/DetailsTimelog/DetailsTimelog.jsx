import React, { useState, useEffect, useRef } from 'react'
import { format, differenceInSeconds } from 'date-fns'
import { ipcRenderer } from 'electron'

import DetailsTitle from '@/components/atoms/DetailsTitle'

import style from './DetailsTimelog.style'

const formatDuration = duration => {
  var hours = Math.floor(duration / 3600)
  var minutes = Math.floor((duration - hours * 3600) / 60)
  var seconds = duration - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes
}

export default ({ action, details }) => {
  const [duration, setDuration] = useState(0)
  const interval = useRef(null)

  const updateDuration = () => {
    const diff = differenceInSeconds(
      new Date(),
      action.payload.workTime.startedAt
    )
    setDuration(diff)
  }

  useEffect(() => {
    if (action.payload.workTime && action.payload.workTime.startedAt) {
      if (interval.current) {
        clearInterval(interval.current)
      }

      updateDuration()
      interval.current = setInterval(updateDuration, 200)
    }
  }, [action.id])

  useEffect(() => () => clearInterval(interval.current), [])

  console.log('details', details, action.payload)

  return (
    <div className={style.Project}>
      <DetailsTitle>{action.payload.project.name}</DetailsTitle>
      <div className={style.timing}>
        {action.payload.workTime.startedAt ? (
          <div className={style.line}>
            <span className={style.label}>Session</span>
            <span className={style.value}>{formatDuration(duration)}</span>
          </div>
        ) : null}
        {details.daily ? (
          <div className={style.line}>
            <span className={style.label}>Today</span>
            <span className={style.value}>
              {formatDuration(details.daily * 60 + duration)}
            </span>
          </div>
        ) : null}
        {details.weekly ? (
          <div className={style.line}>
            <span className={style.label}>Week</span>
            <span className={style.value}>
              {formatDuration(details.weekly * 60 + duration)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
