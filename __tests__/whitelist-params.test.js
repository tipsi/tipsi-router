import { mount } from 'enzyme'
import routes from './setup/routes'
import Router, { createStackNavigation } from '..'


describe('Router with sync whitelist params', () => {
  global.scrollTo = () => {}

  const wrapper = mount(createStackNavigation('/', routes, true, {
    syncSearchWithState: {
      parseInt: true,
    },
  }))

  test('sync State With Params with Parse Int values', () => {
    // If we enabled parseInt and have params in search query we should convert values
    Router.push(null, Router.routes.whiteList, { a: 'paramA', b: 'paramB', c: 'paramC' })
    wrapper.update()

    expect(wrapper.prop('history').location.state.a).toEqual('paramA')
    expect(wrapper.prop('history').location.state.b).toBe(undefined)
    expect(wrapper.prop('history').location.state.c).toEqual('paramC')
  })
})
