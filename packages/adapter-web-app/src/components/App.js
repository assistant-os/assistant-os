import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Chat from 'components/pages/Chat'
import Detail from 'components/pages/Detail'

import style from './App.module.scss'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className={style.App}>
          <Route path="/messages/:messageIndex/:detailId" component={Detail} />
          <Route path="/" component={Chat} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
