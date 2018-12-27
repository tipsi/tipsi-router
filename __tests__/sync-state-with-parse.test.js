import { mount } from 'enzyme'
import routes from './setup/routes'
import Router, { createStackNavigation } from '..'


describe('Router with sync parsed params with state', () => {
  const wrapper = mount(createStackNavigation('/', routes, true, {
    syncSearchWithState: {
      parseInt: true,
    },
  }))

  test('sync State With Params with Parse Int values', () => {
    // If we enabled parseInt and have params in search query we should convert values
    Router.push(null, Router.routes.aboutWithParams)
    wrapper.update()

    expect(wrapper.prop('history').location.state.d).toEqual(1)
    expect(wrapper.prop('history').location.state.e).toEqual(2)

    // But if we pass the params via state we don't should convert type of value
    Router.push(null, Router.routes.about, {
      a: '1',
      b: 2,
    })
    wrapper.update()

    expect(wrapper.prop('history').location.state.a).toEqual('1')
    expect(wrapper.prop('history').location.state.b).toEqual(2)

    wrapper.update()
  })
})
