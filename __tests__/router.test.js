import React, { Component } from 'react'
import { mount } from 'enzyme'
import Router, { createStackNavigation, addInterceptor } from '../'

function DummyComponent(name) {
  return class extends Component {
    static displayName = name

    render() {
      return (
        <div />
      )
    }
  }
}

const routes = {
  home: {
    path: '/',
    component: DummyComponent('Home'),
  },
  about: {
    path: '/about',
    component: DummyComponent('About'),
  },
  details: {
    path: '/details',
    component: DummyComponent('Details'),
  },
  exact: {
    path: '/exact',
    component: DummyComponent('Exact'),
    exact: true,
  },
}

describe('Router without interceptors', () => {
  const wrapper = mount(createStackNavigation('/', routes, true))

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
    expect(Router.getCurrentRoute()).toEqual('/')
    expect(wrapper.prop('history').index).toEqual(0)
  })

  test('Replace', () => {
    Router.push(null, Router.routes.about)
    Router.replace(null, Router.routes.details)
    expect(Router.getCurrentRoute()).toEqual('/details')
    expect(wrapper.prop('history').index).toEqual(1)
  })

  test('popToTop', () => {
    Router.push(null, Router.routes.about)
    expect(wrapper.prop('history').index).toEqual(2)
    Router.popToTop(null)
    expect(Router.getCurrentRoute()).toEqual('/')
    expect(wrapper.prop('history').index).toEqual(0)
  })

  test('showModal', () => {
    spyOn(Router, 'showModal')
    Router.showModal()
    expect(Router.showModal).toHaveBeenCalled()
  })

  test('dismissModal', () => {
    spyOn(Router, 'dismissModal')
    Router.dismissModal()
    expect(Router.dismissModal).toHaveBeenCalled()
  })

  test('ExactPath', () => {
    Router.push(null, Router.routes.exact)
    wrapper.update()
    expect(Router.getCurrentRoute()).toEqual('/exact')
    expect(
      wrapper.findWhere(child => child.prop('path') === Router.routes.exact.path).prop('exact')
    ).toEqual(true)
  })

  test('ExactRootPath', () => {
    Router.push(null, Router.routes.home)
    wrapper.update()
    expect(Router.getCurrentRoute()).toEqual('/')
    expect(
      wrapper.findWhere(child => child.prop('path') === Router.routes.home.path).prop('exact')
    ).toEqual(true)
  })

  test('NotExactPath', () => {
    Router.push(null, Router.routes.about)
    wrapper.update()
    expect(Router.getCurrentRoute()).toEqual('/about')
    expect(
      wrapper.findWhere(child => child.prop('path') === Router.routes.about.path).prop('exact')
    ).toEqual(false)
  })

  test('Push with location-like argument', () => {
    const query = { the: 'query' }
    Router.push(null, {
      ...Router.routes.about,
      query,
    })
    wrapper.update()
    expect(Router.getCurrentRoute()).toEqual('/about')
    expect(wrapper.prop('history').location.search).toEqual('?the=query')
    expect(Router.getCurrentQuery()).toEqual(query)
  })
})


describe('Router with interceptors', () => {
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
    Router.popToTop(null)
    expect(mock).toHaveBeenLastCalledWith({
      method: 'popToTop',
      args: [null],
    })
  })

  test('showModal', () => {
    Router.showModal()
    expect(mock).toHaveBeenLastCalledWith({
      method: 'showModal',
      args: [],
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
