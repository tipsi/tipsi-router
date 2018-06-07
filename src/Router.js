import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { compile } from 'path-to-regexp'
import { parse, stringify } from 'qs'

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
          exact={route.exact || route.path === '/'}
          path={route.path}
          render={props => (
            <route.component {...props} {...props.location.state} />
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

  setTitle(title) {
    document.title = title
  }

  getCurrentRoute() {
    return this.history.location.pathname
  }

  getCurrentQuery() {
    const query = this.history.location.search

    if (query) {
      return parse(query, { ignoreQueryPrefix: true })
    }

    return {}
  }

  config() {}

  callHistoryMethodWithArguments(methodName, e, route, paramsOrOptions = {}) {
    if (e) {
      e.preventDefault()
    }

    const { path, query } = route
    const { config, ...params } = paramsOrOptions

    const location = {
      pathname: compile(path)(params),
      search: query && stringify(query, { addQueryPrefix: true }),
      state: params,
    }

    this.history[methodName](location)
  }

  push(e, route, paramsOrOptions = {}) {
    this.callHistoryMethodWithArguments('push', e, route, paramsOrOptions)
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
    this.callHistoryMethodWithArguments('replace', e, route, paramsOrOptions)
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
