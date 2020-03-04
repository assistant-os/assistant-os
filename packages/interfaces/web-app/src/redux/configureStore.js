import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import credentials, { uri as credentialsUri } from './credentials'
import os, { uri as osUri } from './os'
import messages, { uri as messagesUri } from './messages'
import timelog, { uri as timelogUri } from './timelog'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  [credentialsUri]: credentials,
  [osUri]: os,
  [messagesUri]: messages,
  [timelogUri]: timelog,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
  )

  const persistor = persistStore(store)
  return {
    store,
    persistor,
  }
}
