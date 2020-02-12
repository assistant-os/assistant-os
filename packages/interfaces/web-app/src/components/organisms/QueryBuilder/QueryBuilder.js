import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import Input from 'components/atoms/Input'
import { processUserMessage } from 'redux/os'

import { ReactComponent as Send } from 'assets/send.svg'

import style from './QueryBuilder.module.scss'

const QueryBuilder = () => {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()

  const onSubmit = event => {
    if (query !== '') {
      const message = { text: query }

      dispatch(processUserMessage(message))

      setQuery('')
    }

    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <form className={style.form} onSubmit={onSubmit}>
      <Input
        forceFocus
        value={query}
        className={style.input}
        placeholder="New message"
        onChange={setQuery}
      />
      <button
        type="button"
        className={`${style.submit} ${query ? style.visible : style.disabled}`}
        onClick={onSubmit}
      >
        <Send className={style.icon} />
      </button>
    </form>
  )
}

QueryBuilder.defaultProps = {}

QueryBuilder.propTypes = {}

export default QueryBuilder
