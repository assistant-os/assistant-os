import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Authentication from 'components/templates/Authentication'
import Chat from 'components/templates/Chat'

import './App.scss'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/authenticate" component={Authentication} />
          <Route path="/" component={Chat} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
