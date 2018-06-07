import React from 'react'
import {
  createHistory,
  createMemorySource,
  LocationProvider,
  Router,
  Link as ReachRouterLink,
} from '@reach/router'
import { compile } from 'path-to-regexp'
import { parse, stringify } from 'qs'
import { unwrapChildren } from '../utils'

// Remove warnings
export const NavigationStyles = {}
export function NavigationReducer() {}
export function createNavigationEnabledStore() {}
export const Link = ReachRouterLink

export default class TipsiRouter {
  constructor(initialRoute, routes, useMemoryHistory = false, defaultRouteConfig = {}) {
    this.defaultRouteConfig = defaultRouteConfig
    this.basepath = this.defaultRouteConfig.basename || '/'
    this.history = createHistory(useMemoryHistory ? createMemorySource(this.basepath) : window)
    this.navigationProvider = this.createRouter(routes)
    this.routes = routes
  }

  createRouter(routes) {
    return (
      <LocationProvider history={this.history}>
        {({ location }) => {
          return (
            <Router location={location} basepath={this.basepath}>
              {unwrapChildren(routes)}
            </Router>
          )
        }}
      </LocationProvider>
    )
  }

  setTitle() {}

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

  navigate = async (methodName, e, route, paramsOrOptions = {}) => {
    if (e) {
      e.preventDefault()
    }

    const { path, query } = route
    const { config, ...params } = paramsOrOptions

    const location = {
      pathname: compile(path)(params),
      search: query ? stringify(query, { addQueryPrefix: true }) : '',
      state: params,
    }

    return this.history.navigate(
      `${location.pathname}${location.search}`, {
        state: location.state,
        replace: methodName === 'replace',
      }
    )
  }

  push(e, route, paramsOrOptions) {
    return this.navigate('push', e, route, paramsOrOptions)
  }

  pop(e) {
    if (e) {
      e.preventDefault()
    }

    return this.navigate('pop', e, { path: '../' })
  }

  popToTop(e) {
    if (e) {
      e.preventDefault()
    }

    return this.navigate('popToTop', e, { path: this.basepath })
  }

  replace(e, route, paramsOrOptions) {
    return this.navigate('replace', e, route, paramsOrOptions)
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
