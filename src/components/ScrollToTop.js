import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { find, get } from 'lodash'

let scrollData = {}

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      history: { action },
      location: { pathname },
      routes,
    } = this.props

    const currentRoute = find(
      routes,
      route => route.path === this.props.location.pathname
    )

    const persistScroll = get(currentRoute, 'persistScroll', false)

    if (
      this.props.shouldScrollToTop &&
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      if (action === 'POP' && persistScroll && scrollData[pathname]) {
        setTimeout(() => {
          window.scrollTo(0, scrollData[pathname])
        })
      } else {
        setTimeout(() => {
          window.scrollTo(0, 0)
        })
      }
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const {
      history: { action },
      location: { pathname },
    } = prevProps

    if (action !== 'POP') {
      scrollData = { ...scrollData, [pathname]: window.pageYOffset }
    }

    return null
  }

  render() {
    return this.props.children
  }
}

ScrollToTop.propTypes = {
  children: PropTypes.node.isRequired,
  shouldScrollToTop: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ScrollToTop)
