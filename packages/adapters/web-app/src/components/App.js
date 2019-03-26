import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Chat from 'components/pages/Chat'
import Detail from 'components/pages/Detail'
import Welcome from 'components/pages/Welcome'

import style from './App.module.scss'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className={style.App}>
          <Route path="/messages/:messageIndex/:detailId" component={Detail} />
          <Route path="/messages" component={Chat} />
          <Route path="/" component={Welcome} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
