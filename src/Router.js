import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { compile } from 'path-to-regexp'

// Remove warnings
export const NavigationStyles = {}
export function NavigationReducer() {}
export function createNavigationEnabledStore() {}

export default class TipsiRouter {
  constructor(initialRoute, routes, useMemoryHistory = false, defaultRouteConfig = {}) {
    this.defaultRouteConfig = defaultRouteConfig
    this.history = useMemoryHistory
      ? this.createMemoryHistory(initialRoute, routes)
      : createHistory({ basename: defaultRouteConfig.basename || '/' })
    this.navigationProvider = this.createRouter(initialRoute, routes)
    this.routes = routes
  }

  /* eslint-disable class-methods-use-this */
  createMemoryHistory(initialRoute, routes) {
    const initialEntries = Object.values(routes).map(route => route.path)
    const initialIndex = initialEntries.indexOf(initialRoute)

    return createMemoryHistory({ initialEntries, initialIndex })
  }

  createRouter(initialRoute, routes) {
    const elements = Object.entries(routes).reduce((memo, [key, route]) => (
      memo.concat(
        <Route
          key={key}
          exact={route.path === '/'}
          path={route.path}
          render={props => (
            <route.component {...props} {...props.history.location.state} />
          )}
        />
      )
    ), [])

    return (
      <Router history={this.history} {...this.defaultRouteConfig}>
        <Switch>
          {elements}
        </Switch>
      </Router>
    )
  }

  setTitle() {}

  getCurrentRoute() {
    return this.history.location.pathname
  }

  config() {}

  push(e, route, paramsOrOptions = {}) {
    if (e) {
      e.preventDefault()
    }
    const toPath = compile(route.path)
    const path = toPath(paramsOrOptions)
    const { config, ...params } = paramsOrOptions
    this.history.push(path, params)
  }

  pop(e) {
    if (e) {
      e.preventDefault()
    }
    this.history.goBack()
  }

  popToTop(e) {
    if (e) {
      e.preventDefault()
    }
    this.history.go(-this.history.index)
  }

  replace(e, route, paramsOrOptions = {}) {
    if (e) {
      e.preventDefault()
    }
    const toPath = compile(route.path)
    const path = toPath(paramsOrOptions)
    this.history.replace(path)
  }

  showModal(e) {
    if (e) {
      e.preventDefault()
    }
  }

  dismissModal(e) {
    if (e) {
      e.preventDefault()
    }
  }
}
