import Router from './src/Router'

const SingletonRouter = {
  router: null,
}

const coreMethodFields = [
  'push',
  'pop',
  'popToTop',
  'replace',
  'showModal',
  'dismissModal',
  'config',
  'setTitle',
  'getCurrentRoute',
  'getCurrentQuery',
  'updateParams',
  'updateTitle',
]

const propertyFields = ['routes']

coreMethodFields.forEach((field) => {
  SingletonRouter[field] = (...args) => SingletonRouter.router[field](...args)
})

propertyFields.forEach((field) => {
  Object.defineProperty(SingletonRouter, field, {
    get() {
      return SingletonRouter.router[field]
    },
  })
})

export {
  NavigationStyles,
  NavigationReducer,
  createNavigationEnabledStore,
} from './src/Router'

export function createStackNavigation(initialRoute, routes, useMemoryHistory, defaultRouteConfig) {
  if (!SingletonRouter.router) {
    SingletonRouter.router = new Router(initialRoute, routes, useMemoryHistory, defaultRouteConfig)
  }

  return SingletonRouter.router.navigationProvider
}

export default SingletonRouter
