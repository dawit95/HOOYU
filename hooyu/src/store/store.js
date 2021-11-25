import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function Store() {
  const store = createStore(reducers, composeEnhancers(
    applyMiddleware(promiseMiddleware)
  ))
  return store
}