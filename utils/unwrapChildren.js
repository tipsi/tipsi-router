import React from 'react'

export default function unwrapChildren(routes, acc = []) {
  return routes.reduce((memo, { Route, path, children }, index) => {
    if (!children || Array.isArray(children) && !children.length) {
      return memo.concat(
        <Route path={path} key={path} />
      )
    }

    return memo.concat(
      <Route path={path} key={path}>
        {unwrapChildren(children)}
      </Route>
    )
  }, acc)
}
