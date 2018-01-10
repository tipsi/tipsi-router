import React from 'react'
import { findKey, merge } from 'lodash'
import {
  NavigationProvider,
  NavigationContext,
  StackNavigation,
  createRouter,
  NavigationStyles,
} from '@expo/ex-navigation'

const rootNavigatorID = 'root'
const appNavigatorID = 'app'

export {
  NavigationStyles,
  createNavigationEnabledStore,
  NavigationReducer,
} from '@expo/ex-navigation'

export default class TipsiRouter {
  /* eslint-disable no-unused-vars */
  constructor(initialRoute, routes, useMemoryHistory = false, defaultRouteConfig = {}) {
    const App = this.createAppComponent(initialRoute, defaultRouteConfig)
    const expoRouter = this.createRoutes({ ...routes, app: { component: App } })

    this.routes = routes
    this.navigationContext = new NavigationContext({ router: expoRouter })
    this.navigationProvider = this.stackNavigationProvider(initialRoute, expoRouter)
  }

  createRoutes = (appRoutes) => {
    const routes = Object.keys(appRoutes).reduce((memo, key) => ({
      ...memo,
      [key]: () => appRoutes[key].component,
    }), {})

    return createRouter(() => routes, { ignoreSerializableWarnings: true })
  }

  stackNavigationProvider = () => (
    <NavigationProvider context={this.navigationContext}>
      <StackNavigation
        id={rootNavigatorID}
        initialRoute="app"
        defaultRouteConfig={{ styles: NavigationStyles.SlideVertical }}
      />
    </NavigationProvider>
  )

  createAppComponent = (initialRoute, defaultRouteConfig) => () => (
    <StackNavigation
      id={appNavigatorID}
      initialRoute={initialRoute}
      defaultRouteConfig={defaultRouteConfig}
    />
  )

  config = (params) => {
    const navigator = this.navigationContext.getNavigator(appNavigatorID)
    const currentRoute = navigator.getCurrentRoute()
    currentRoute.config = merge(currentRoute.config, params)
  }

  setTitle = (title) => {
    this.config({ navigationBar: { title } })
  }

  updateParams = (params = {}) => {
    const navigator = this.navigationContext.getNavigator(appNavigatorID)
    navigator.updateCurrentRouteParams(params)
  }

  updateTitle = (title) => {
    this.setTitle(title)
    this.updateParams()
  }

  /* eslint-disable no-underscore-dangle */
  push = (e, route, paramsOrOptions = {}) => {
    const { config = {}, ...params } = paramsOrOptions
    const { transitionGroup, ...restConfig } = config
    const navigator = this.navigationContext.getNavigator(appNavigatorID)
    const expoRoute = this.navigationContext._router.getRoute(this.routeName(route), params)

    expoRoute.config = { ...restConfig }

    this.navigationContext.performAction(({ stacks }) => {
      stacks(navigator.navigatorUID).push(expoRoute)
    })
  }

  pop = () => {
    this.navigationContext.getNavigator(appNavigatorID).pop()
  }

  popToTop = () => {
    this.navigationContext.getNavigator(appNavigatorID).popToTop()
  }

  replace = (e, route, paramsOrOptions = {}) => {
    const { config = {}, ...params } = paramsOrOptions
    const navigator = this.navigationContext.getNavigator(appNavigatorID)
    const expoRoute = this.navigationContext._router.getRoute(this.routeName(route), params)

    expoRoute.config = { ...config }

    navigator.componentInstance._useAnimation = false

    this.navigationContext.performAction(({ stacks }) => {
      stacks(navigator.navigatorUID).replace(expoRoute)
    })

    requestAnimationFrame(() => {
      navigator.componentInstance._useAnimation = true
    })
  }

  showModal = (e, route, paramsOrOptions = {}, delay = 0) => {
    const { config = {}, ...params } = paramsOrOptions
    const navigator = this.navigationContext.getNavigator(rootNavigatorID)
    const expoRoute = this.navigationContext._router.getRoute(this.routeName(route), params)

    expoRoute.config = { ...config }

    const pushScene = () => this.navigationContext.performAction(({ stacks }) => {
      stacks(navigator.navigatorUID).push(expoRoute)
    })

    delay ? setTimeout(pushScene, delay) : pushScene()
  }

  dismissModal = () => {
    this.navigationContext.getNavigator(rootNavigatorID).pop()
  }

  routeName = route => findKey(this.routes, { path: route.path })
}
