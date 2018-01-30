import React from 'react'
import {
  Router,
  Switch,
  Route
} from 'react-router-dom'
import { reduce, keys, indexOf } from 'lodash'
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory'
import { compile, parse } from 'path-to-regexp'

export default class TipsiRouter {
  constructor(initialRoute, routes, useMemoryHistory = false) {
    this.history = useMemoryHistory ? this.createMemoryHistory(initialRoute, routes) : createHistory()
    this.navigationProvider = this.createRouter(initialRoute, routes)
    this.routes = routes
  }

  createMemoryHistory(initialRoute, routes) {
    const initialEntries = Object.entries(routes).reduce((memo, [key, route]) => (
      memo.concat(
        route.path
      )
    ), [])
    const initialIndex = indexOf(initialEntries, initialRoute)
    return createMemoryHistory({ initialEntries, initialIndex })
  }

  createRouter(initialRoute, routes) {
    const elements = Object.entries(routes).reduce((memo, [key, route]) => (
      memo.concat(
        <Route
          key
          exact={route.path === '/'}
          path={route.path}
          render={(props) => (<route.component {...props.history.location.state} />)}
          // component={route.component}
        />
      )
    ), [])
    return(
      <Router history={this.history}>
        <Switch>
          {elements}
        </Switch>
      </Router>
    )
  }

  setTitle(title) {
  }

  push(e, route, paramsOrOptions = {}) {
    console.log('Push')
    if (e) {
      e.preventDefault()
    }
    const toPath = compile(route.path)
    const path = toPath(paramsOrOptions)
    const { config = {}, ...params } = paramsOrOptions
    this.history.push(path, params)
  }

  pop(e) {
    console.log('Pop')
    if (e) {
      e.preventDefault()
    }
    this.history.goBack()
  }

  popToTop(e) {
    if (e) {
      e.preventDefault()
    }
    console.log('popToTop')
  }

  replace(e, route, paramsOrOptions = {}) {
    console.log('Replace')
    if (e) {
      e.preventDefault()
    }
    const toPath = compile(route.path)
    const path = toPath(paramsOrOptions)
    this.history.replace(path)
  }

  showModal(e, route, paramsOrOptions = {}) {
    if (e) {
      e.preventDefault()
    }
    console.log('Show modal');
  }

  dismissModal(e) {
    if (e) {
      e.preventDefault()
    }
    console.log('Dissmis modal');
  }
}
