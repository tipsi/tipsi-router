import React from 'react'
import { unwrapChildren } from '../../utils'

describe('unwrapChildren', () => {
  it('should unwrap children recursively', () => {
    const Route = () => <div />

    const routes = [{
      Route: children => children,
      path: '/',
      children: [
        { Route, path: 'login' },
        {
          Route: children => children,
          path: 'about',
          children: [],
        },
        {
          Route: children => children,
          path: 'stores',
          children: [{ Route, path: ':storeId' }],
        },
      ],
    }]

    expect(unwrapChildren(routes)).toMatchSnapshot()
  })
})
