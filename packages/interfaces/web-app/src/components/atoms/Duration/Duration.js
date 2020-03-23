import React, { useState, useEffect, useRef } from 'react'
import PropType from 'prop-types'

const addZero = number => (number < 10 ? `0${number}` : number)

const calculateDurationToNow = date => {
  const diff = new Date() - new Date(date)

  const HOURS = 1000 * 60 * 60

  const hours = Math.floor(diff / HOURS)
  const minutes = Math.floor((diff % HOURS) / 1000)

  return `${addZero(hours)}:${addZero(minutes)}`
}

const Duration = ({ startAt }) => {
  const [duration, setDuration] = useState(null)
  const interval = useRef()

  const updateDuration = () => {
    setDuration(calculateDurationToNow(startAt))
  }

  useEffect(() => {
    updateDuration()
    if (interval.current) {
      clearInterval(interval.current)
    }
    interval.current = setInterval(updateDuration, 1000)

    return () => clearInterval(interval.current)
  }, [startAt])

  return <>{duration}</>
}

Duration.defaultProps = {
  startAt: new Date(),
}

Duration.propTypes = {
  startAt: PropType.instanceOf(Date),
}

export default Duration
