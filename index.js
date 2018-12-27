import Router from './src/Router'

const SingletonRouter = {
  router: null,
  interceptors: [],
}

const navigationMethodFields = [
  'push',
  'pop',
  'popToTop',
  'replace',
  'showModal',
  'dismissModal',
]

const coreMethodFields = [
  'config',
  'setTitle',
  'getCurrentRoute',
  'getCurrentQuery',
  'updateParams',
  'updateTitle',
  'subscribe',
  'subscribe',
  'unsubscribe',
  'broadcast',
]

const propertyFields = ['routes']

navigationMethodFields.forEach((field) => {
  SingletonRouter[field] = (...args) => {
    const interceptorArgs = {
      method: field,
      args,
    }
    const interceptorResult = SingletonRouter.interceptors.reduce(
      (previousResult, interceptor) => interceptor(previousResult),
      interceptorArgs
    )
    return SingletonRouter.router[field](...interceptorResult.args)
  }
})

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

export function addInterceptor(interceptor) {
  SingletonRouter.interceptors.push(interceptor)
}

export default SingletonRouter
