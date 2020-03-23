import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Form from 'components/atoms/Form'
import Input from 'components/atoms/Input'
import Button from 'components/atoms/Button'

import { login } from 'redux/credentials'

import style from './Login.module.scss'
import inputStyle from 'styles/input.module.scss'
import buttonStyle from 'styles/button.module.scss'

export default () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [url, setUrl] = useState('')

  const ref = useRef()

  useEffect(() => {
    ref.current.focus()
  }, [])

  const onSubmit = () => {
    dispatch(login(url))
    history.push('/')
  }

  return (
    <div className={style.Login}>
      <Form className={style.form} onSubmit={onSubmit}>
        <Input
          className={`${inputStyle.basic} ${style.input}`}
          placeholder="Enter server url"
          value={url}
          onChange={value => setUrl(value)}
          ref={ref}
        />
        <Button
          type="submit"
          className={`${buttonStyle.primary} ${style.submit}`}
        >
          Log in
        </Button>
      </Form>
    </div>
  )
}
