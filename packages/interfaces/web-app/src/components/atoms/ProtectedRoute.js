import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { isAuthenticated } from 'redux/credentials'

export default props => {
  const authenticated = useSelector(isAuthenticated)

  if (authenticated) {
    console.log('authenticated', authenticated)
    return <Route {...props} />
  }

  return <Redirect to="/login" />
}
