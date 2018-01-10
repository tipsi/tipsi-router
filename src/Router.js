import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { compile } from 'path-to-regexp'

export default class TipsiRouter {
  constructor(initialRoute, routes, useMemoryHistory = false) {
    this.history = useMemoryHistory ? createMemoryHistory() : createHistory()
    this.navigationProvider = this.createRouter(initialRoute, routes)
    this.routes = routes
  }

  createRouter(initialRoute, routes) {
    const elements = Object.entries(routes).reduce((memo, [key, route]) => (
      memo.concat(
        <Route
          key={key}
          exact={route.path === initialRoute}
          path={route.path}
          component={route.component}
        />
      )
    ), [])

    return (
      <Router history={this.history}>
        <Switch>
          {elements}
        </Switch>
      </Router>
    )
  }

  setTitle = () => {}

  push = (event, route, paramsOrOptions = {}) => {
    const toPath = compile(route.path)
    const path = toPath(paramsOrOptions)
    this.history.push(path)
  }

  pop = (event) => {
    event.preventDefault()
    this.history.goBack()
  }

  popToTop = (event) => {
    event.preventDefault()
  }

  replace = (event, route, paramsOrOptions = {}) => {
    event.preventDefault()

    const toPath = compile(route.path)
    const path = toPath(paramsOrOptions)
    this.history.replace(path)
  }

  showModal = (event) => {
    event.preventDefault()
  }

  dismissModal = (event) => {
    event.preventDefault()
  }
}
