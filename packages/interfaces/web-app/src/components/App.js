import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

// import Detail from 'components/pages/Detail'
import Welcome from 'components/pages/Welcome'
import Login from 'components/pages/Login'
// import Discussion from 'components/pages/Discussion'
import Search from 'components/pages/Search'
import ProtectedRoute from 'components/atoms/ProtectedRoute'

import style from './App.module.scss'

const App = ({ history }) => {
  return (
    <div className={style.App}>
      <ProtectedRoute path="/" exact>
        <Search />
      </ProtectedRoute>
      <Route path="/login">
        <Login />
      </Route>
    </div>
  )
}

export default withRouter(App)
