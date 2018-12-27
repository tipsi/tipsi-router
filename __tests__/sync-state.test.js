import { mount } from 'enzyme'
import routes from './setup/routes'
import Router, { createStackNavigation } from '..'

describe('Router with sync params with state', () => {
  const wrapper = mount(createStackNavigation('/', routes, true, {
    syncSearchWithState: true,
  }))

  test('sync State With Params', () => {
    const testObject = { a: 'paramA', b: 'paramB' }
    const testDeepObject = { a: 'paramA', b: 'paramB', c: { ab: 1 }, d: [1, 2, 3] }
    Router.push(null, Router.routes.about, testObject)
    wrapper.update()

    expect(wrapper.prop('history').location.search).toEqual('?a=paramA&b=paramB')
    expect(wrapper.prop('history').location.state).toEqual(testObject)

    Router.push(null, Router.routes.about, testDeepObject)
    wrapper.update()

    expect(wrapper.prop('history').location.search).toEqual(
      '?a=paramA&b=paramB&c%5Bab%5D=1&d%5B0%5D=1&d%5B1%5D=2&d%5B2%5D=3'
    )

    expect(wrapper.prop('history').location.state).toEqual({
      a: 'paramA',
      b: 'paramB',
      c: { ab: 1 },
      d: [1, 2, 3],
    })

    Router.push(null, Router.routes.aboutWithDeepParams)
    wrapper.update()

    expect(wrapper.prop('history').location.search).toEqual(
      '?c%5B0%5D=1&c%5B1%5D=2&c%5B2%5D=3&d%5Baa%5D=1&d%5Bab%5D=test'
    )

    expect(wrapper.prop('history').location.state).toEqual({
      c: ['1', '2', '3'], d: { aa: '1', ab: 'test' },
    })


    Router.push(null, Router.routes.aboutWithFilteredParams)
    wrapper.update()

    expect(wrapper.prop('history').location.search).toEqual('?a=paramC&c=2')

    Router.push(null, Router.routes.aboutWithFilteredParams, {
      d: 'dValue',
      e: 'eValue',
      f: 'fValue',
    })
    wrapper.update()

    expect(wrapper.prop('history').location.search).toEqual('?a=paramC&c=2&e=eValue')
  })
})
