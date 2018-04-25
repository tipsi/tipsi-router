import React, { Component } from 'react'
import { mount } from 'enzyme'
import Router, { createStackNavigation } from '../'

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

describe('Router', () => {
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

  const wrapper = mount(createStackNavigation('/', routes, true))

  test('Push', () => {
    Router.push(null, Router.routes.about)
    expect(Router.getCurrentRoute()).toEqual('/about')
    expect(wrapper.prop('history').index).toEqual(1)
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
})
