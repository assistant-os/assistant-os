import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loadable from 'react-loadable'
import { HashRouter } from 'react-router-dom'

import configureStore from 'redux/configureStore'

import './index.css'
import * as serviceWorker from './serviceWorker'

const { store, persistor } = configureStore()

const Load = Loadable({
  loader: () => import('components/App'),
  loading: () => <div />,
})

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <Load />
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
serviceWorker.register()
