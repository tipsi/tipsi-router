import React, { Component } from 'react'

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

export default {
  home: {
    path: '/',
    component: DummyComponent('Home'),
  },
  about: {
    path: '/about',
    component: DummyComponent('About'),
  },
  aboutWithParams: {
    path: '/about_parse',
    component: DummyComponent('About'),
    query: { c: 'paramC', d: '1', e: 2 },
  },
  aboutWithFilteredParams: {
    path: '/about_filters',
    component: DummyComponent('About'),
    query: { a: 'paramC', b: '1', c: 2 },
    syncFilterFields: ['a', 'c', 'e'],
  },
  aboutWithDeepParams: {
    path: '/about_deep',
    component: DummyComponent('About'),
    query: { c: [1, 2, 3], d: { aa: 1, ab: 'test' } },
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
  login: {
    path: '/login',
    component: DummyComponent('Login'),
    modal: true,
  },
  whiteList: {
    path: '/login',
    component: DummyComponent('WhiteListParams'),
    whiteListParams: ['a', 'c'],
  },
  redirectFromRule: {
    redirectFrom: '/path_to_redirect_from',
    redirectTo: '/details'
  },
  redirectToAbout: {
    redirectTo: '/about',
  },
}
