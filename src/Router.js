import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { ModalRoute } from 'react-router-modal'
import createBrowserHistory from 'history/createBrowserHistory'
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
    this.basename = defaultRouteConfig.basename || '/'
    this.history = useMemoryHistory
      ? this.createMemoryHistory(initialRoute, routes)
      : createBrowserHistory({ basename: this.basename })
    this.navigationProvider = this.createRouter(initialRoute, routes)
    this.routes = routes
    this.stack = 0
  }

  /* eslint-disable class-methods-use-this */
  createMemoryHistory(initialRoute, routes) {
    const initialEntries = Object.values(routes).map(route => route.path)
    const initialIndex = initialEntries.indexOf(initialRoute)

    return createMemoryHistory({ initialEntries, initialIndex })
  }

  createRouter(initialRoute, routes) {
    const elements = Object.entries(routes).reduce((memo, [key, route]) => {
      const RouteContainer = route.modal ? ModalRoute : Route
      const RouteComponent = route.component

      const render = props => (
        <RouteComponent isFocused {...props} {...props.location.state} /> // eslint-disable-line
      )

      const renderProps = route.modal ? { component: render } : { render }

      return memo.concat(
        <RouteContainer
          key={key}
          exact={route.exact || route.path === '/'}
          path={route.path}
          {...renderProps}
        />
      )
    }, [])

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
    this.stack += 1
  }

  pop(e) {
    if (e) {
      e.preventDefault()
    }

    this.history.goBack()
    this.stack = this.stack === 0 ? 0 : this.stack - 1
  }

  popToTop(e) {
    if (e) {
      e.preventDefault()
    }

    if (this.stack !== 0) {
      this.history.go(-this.stack)
    } else if (this.history.location.pathname !== this.basename) {
      this.replace(e, { path: this.basename })
    }

    this.stack = 0
  }

  replace(e, route, paramsOrOptions = {}) {
    this.callHistoryMethodWithArguments('replace', e, route, paramsOrOptions)
  }

  showModal(e, route, paramsOrOptions = {}) {
    this.callHistoryMethodWithArguments('push', e, route, paramsOrOptions)
  }

  async dismissModal(e) {
    if (e) {
      e.preventDefault()
    }

    this.history.goBack()

    // Avoid incorrect push-transition after dismiss
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}
