import { mount } from 'enzyme'
import routes from './setup/routes'
import Router, { createStackNavigation, addInterceptor } from '..'

describe('Router without interceptors', () => {
  const wrapper = mount(createStackNavigation('/', routes, true))
  const findExactPathPropForRoute = routePath => (
    wrapper.findWhere(child => child.prop('path') === routePath).prop('exact')
  )

  test('Push', () => {
    Router.push(null, Router.routes.about, { goToProps: true })
    expect(Router.getCurrentRoute()).toEqual('/about')

    wrapper.update()
    expect(wrapper.prop('history').index).toEqual(1)
    expect(wrapper.find('About').prop('goToProps')).toBe(true)
    expect(wrapper.find('About').prop('location').state.goToProps).toBe(true)
  })

  test('Pop', () => {
    Router.pop()

    expect(Router.getCurrentRoute()).toEqual(Router.routes.home.path)
    expect(wrapper.prop('history').index).toEqual(0)
  })

  test('Replace', () => {
    Router.push(null, Router.routes.about)
    Router.replace(null, Router.routes.details)

    expect(Router.getCurrentRoute()).toEqual(Router.routes.details.path)
    expect(wrapper.prop('history').index).toEqual(1)
  })

  test('popToTop', () => {
    Router.push(null, Router.routes.about)
    expect(wrapper.prop('history').index).toEqual(2)

    Router.popToTop()
    expect(Router.getCurrentRoute()).toEqual(Router.routes.home.path)
    expect(wrapper.prop('history').index).toEqual(0)
  })

  test('showModal', () => {
    Router.showModal(null, Router.routes.login)
    wrapper.update()

    expect(Router.getCurrentRoute()).toEqual(Router.routes.login.path)
  })

  test('dismissModal', async () => {
    await Router.dismissModal()
    expect(Router.getCurrentRoute()).toEqual(Router.routes.home.path)
  })

  test('ExactPath', () => {
    Router.push(null, Router.routes.exact)
    wrapper.update()

    expect(Router.getCurrentRoute()).toEqual(Router.routes.exact.path)
    expect(findExactPathPropForRoute(Router.routes.exact.path)).toEqual(true)
  })

  test('ExactRootPath', () => {
    Router.push(null, Router.routes.home)
    wrapper.update()

    expect(Router.getCurrentRoute()).toEqual(Router.routes.home.path)
    expect(findExactPathPropForRoute(Router.routes.home.path)).toEqual(true)
  })

  test('NotExactPath', () => {
    Router.push(null, Router.routes.about)
    wrapper.update()

    expect(Router.getCurrentRoute()).toEqual(Router.routes.about.path)
    expect(findExactPathPropForRoute(Router.routes.about.path)).toEqual(false)
  })

  test('Push with location-like argument', () => {
    const query = { the: 'query' }

    Router.push(null, { ...Router.routes.about, query })
    wrapper.update()

    expect(Router.getCurrentRoute()).toEqual(Router.routes.about.path)
    expect(wrapper.prop('history').location.search).toEqual('?the=query')
    expect(Router.getCurrentQuery()).toEqual(query)
  })
})


describe('Router with interceptors', () => {
  global.scrollTo = () => {}

  createStackNavigation('/', routes, true)

  const mock = jest.fn() // eslint-disable-line no-undef
  const interceptor = (args) => {
    mock(args)
    return args
  }
  addInterceptor(interceptor)

  test('Push', () => {
    Router.push(null, Router.routes.about, { goToProps: true })
    expect(mock).toHaveBeenCalledWith({
      method: 'push',
      args: [
        null,
        Router.routes.about,
        { goToProps: true },
      ],
    })
  })

  test('Pop', () => {
    Router.pop()
    expect(mock).toHaveBeenLastCalledWith({
      method: 'pop',
      args: [],
    })
  })

  test('Replace', () => {
    Router.push(null, Router.routes.about)
    expect(mock).toHaveBeenLastCalledWith({
      method: 'push',
      args: [
        null,
        Router.routes.about,
      ],
    })
    Router.replace(null, Router.routes.details)
    expect(mock).toHaveBeenLastCalledWith({
      method: 'replace',
      args: [
        null,
        Router.routes.details,
      ],
    })
  })

  test('popToTop', () => {
    Router.push(null, Router.routes.about)
    expect(mock).toHaveBeenLastCalledWith({
      method: 'push',
      args: [
        null,
        Router.routes.about,
      ],
    })
    Router.popToTop()
    expect(mock).toHaveBeenLastCalledWith({
      method: 'popToTop',
      args: [],
    })
  })

  test('showModal', () => {
    Router.showModal(null, Router.routes.login)
    expect(mock).toHaveBeenLastCalledWith({
      method: 'showModal',
      args: [
        null,
        Router.routes.login,
      ],
    })
  })

  test('dismissModal', () => {
    Router.dismissModal()
    expect(mock).toHaveBeenLastCalledWith({
      method: 'dismissModal',
      args: [],
    })
  })
})
