import React, { useState, useEffect, useRef } from 'react'
import { format, differenceInSeconds } from 'date-fns'

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

export default ({ action }) => {
  const [duration, setDuration] = useState(0)
  const interval = useRef(null)

  const updateDuration = () => {
    const diff = differenceInSeconds(
      new Date(),
      action.payload.workTime.startedAt
    )
    setDuration(diff)
  }

  console.log('action', action)

  useEffect(() => {
    console.log('coucou', action.payload.workTime)
    if (!action.payload.workTime || !action.payload.workTime.startedAt) {
      return
    }

    if (interval.current) {
      clearInterval(interval.current)
    }

    updateDuration()
    interval.current = setInterval(updateDuration, 200)
  }, [action.id])

  useEffect(() => () => clearInterval(interval.current), [])

  return (
    <div className={style.Project}>
      <h1 className={style.title}>{action.payload.project.name}</h1>
      <div className={style.timing}>
        {action.payload.workTime.startedAt ? (
          <div className={style.session}>
            <span className={style.label}>session:</span>
            {formatDuration(duration)}
          </div>
        ) : null}
        {action.payload.workTime.daily ? (
          <div className={style.session}>
            <span className={style.label}>day:</span>
            {formatDuration(action.payload.workTime.daily * 60 + duration)}
          </div>
        ) : null}
        {action.payload.workTime.weekly ? (
          <div className={style.session}>
            <span className={style.label}>week:</span>
            {formatDuration(action.payload.workTime.weekly * 60 + duration)}
          </div>
        ) : null}
      </div>
    </div>
  )
}
