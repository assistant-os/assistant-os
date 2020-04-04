import React, { useState, useEffect, useRef } from 'react'
import { ipcRenderer } from 'electron'

import Icon from '@/components/atoms/Icon'
import List from '@/components/molecules/List'
import Details from '@/components/molecules/Details'
import search from '@/assets/search'
import icons from '@/assets/icons'

import style from './Spotlight.style'

const items = [
  { id: '1', label: 'Pollen Metrology ' },
  { id: '2', label: 'Pollen Metrology ' },
]

const findChoices = value => {
  if (value === '') {
    return []
  }

  return items.filter(item =>
    item.label.toLowerCase().includes(value.toLowerCase())
  )
}

export default () => {
  const input = useRef()

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [choices, setChoices] = useState([])

  const focus = () => input.current.focus()

  useEffect(() => {
    focus()
    ipcRenderer.on('actions', (event, arg) => {
      setActive(arg.length > 0 ? 0 : null)
      setChoices(arg)
    })

    ipcRenderer.on('query', () => {
      setQuery()
    })
  }, [])

  const onQueryChange = event => {
    const { value } = event.target
    setQuery(value)
    ipcRenderer.send('query-change', { query: value })
  }

  const onKeyDown = event => {
    if (event.key === 'ArrowUp') {
      if (active > 0) {
        setActive(active - 1)
      }

      event.preventDefault()
    } else if (event.key === 'ArrowDown') {
      if (active < choices.length - 1) {
        setActive(active + 1)
      }

      event.preventDefault()
    } else if (event.key === 'Enter') {
      if (active !== null) {
        ipcRenderer.send('query-execute', {
          query,
          action: choices[active],
        })
      }
      event.preventDefault()
    } else if (event.key === 'Escape') {
      if (query) {
        setQuery('')
        ipcRenderer.send('query-change', { query: '' })
      } else {
        ipcRenderer.send('close', { query })
      }
      event.preventDefault()
    } else if (event.key === 'Tab') {
      event.preventDefault()
    }
  }

  const onClick = newActive => {
    setActive(active)
    input.current.focus()
  }

  let placeholder = ''

  if (active !== null && choices[active]) {
    placeholder = `${query}${choices[active].label.substring(query.length)}`

    if (choices[active].subLabel) {
      placeholder += ` ― ${choices[active].subLabel}`
    }
  }

  return (
    <div className={style.Spotlight}>
      <div className={style.search}>
        <div className={style.iconContainer} onClick={focus}>
          <Icon className={style.icon} src={search}></Icon>
        </div>
        <div className={style.inputContainer}>
          <input
            type="text"
            className={style.inputPlaceholder}
            value={placeholder}
            readOnly
          />
          <input
            placeholder="Search"
            type="text"
            className={style.input}
            ref={input}
            value={query}
            onKeyDown={onKeyDown}
            onChange={onQueryChange}
          />
        </div>
        {active !== null && choices[active] ? (
          <div className={style.iconContainer} onClick={focus}>
            <Icon
              className={style.icon}
              src={icons[choices[active].icon]}
            ></Icon>
          </div>
        ) : null}
      </div>
      {query !== '' && choices.length > 0 ? (
        <div className={style.choices}>
          <List
            className={style.list}
            items={choices}
            active={choices[active]}
            onClick={onClick}
          />
          <Details className={style.details} action={choices[active]} />
        </div>
      ) : null}
    </div>
  )
}
