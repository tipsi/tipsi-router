import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.shouldScrollToTop &&
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

ScrollToTop.propTypes = {
  children: PropTypes.node.isRequired,
  shouldScrollToTop: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(ScrollToTop)
