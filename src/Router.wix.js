import { Navigation, ScreenVisibilityListener } from 'react-native-navigation'
import platformSpecific from 'react-native-navigation/src/deprecated/platformSpecificDeprecated'
import { keys, findKey } from 'lodash'

export default class TipsiRouter {
  constructor(initialRoute, routes) {
    this.registerScreens(routes)
    this.stackNavigationProvider()
    this.registerScreenVisibilityListener()
    this.routes = routes
  }

  registerScreens = (routes) => {
    keys(routes).forEach((key) => {
      Navigation.registerComponent(key, () => routes[key].component)
    })
  }

  registerScreenVisibilityListener() {
    new ScreenVisibilityListener({
      didAppear: event => this.parseVisibilityEvent(event),
    }).register()
  }

  stackNavigationProvider = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'home', // unique ID registered with Navigation.registerScreen
        title: 'Home', // title of the screen as appears in the nav bar (optional)
      },
    })
  }

  parseVisibilityEvent = async (event) => {
    if (event.commandType === 'InitialScreen' || event.commandType === 'ShowModal') {
      const { screenId } = await Navigation.getCurrentlyVisibleScreenId()
      this[event.commandType === 'InitialScreen' ? 'navigatorID' : 'modalNavigatorID'] = screenId
    }
  }

  getNavigatorID = () => this.modalNavigatorID || this.navigatorID

  getCurrentRoute = () => {}

  getCurrentQuery = () => {}

  config = () => {}

  setTitle = title => (
    platformSpecific.navigatorSetTitle({ navigatorID: this.getNavigatorID() }, { title })
  )

  push = (e, route, paramsOrOptions = {}) => {
    const { config = {}, ...params } = paramsOrOptions
    const { navigationBar = {} } = config

    platformSpecific.navigatorPush({ navigatorID: this.getNavigatorID() }, {
      screen: this.routeName(route),
      title: navigationBar.title,
      passProps: params,
    })
  }

  pop = () => platformSpecific.navigatorPop({ navigatorID: this.getNavigatorID() }, {})

  popToTop = () => platformSpecific.navigatorPopToRoot({ navigatorID: this.getNavigatorID() }, {})

  replace(e, route, paramsOrOptions = {}) {
    const { config = {}, ...params } = paramsOrOptions
    const { navigationBar = {} } = config

    platformSpecific.navigatorPop({ navigatorID: this.getNavigatorID() }, { animated: false })
    platformSpecific.navigatorPush({ navigatorID: this.getNavigatorID() }, {
      screen: this.routeName(route),
      title: navigationBar.title,
      animated: false,
      passProps: params,
    })
  }

  showModal = (e, route, paramsOrOptions) => {
    const { config, ...params } = paramsOrOptions
    const { navigationBar = {} } = config
    Navigation.showModal({
      screen: this.routeName(route),
      title: navigationBar.title,
      passProps: params,
      navigatorButtons: {
        leftButtons: [{
          title: 'Cancel',
          id: 'dismissModal',
        }],
      },
    })
  }

  dismissModal = () => {
    this.modalNavigatorID = null
    Navigation.dismissModal()
  }

  routeName = route => findKey(this.routes, { path: route.path })
}
