import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Router from 'tipsi-router'
import PropTypes from 'prop-types'
import testID from './testID'
import Button from './Button'

export default class Details extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    showButtons: PropTypes.bool,
  }

  static defaultProps = {
    showButtons: true,
  }

  componentWillMount = () => {
    Router.setTitle('Details')
  }

  onPressHandler = () => {
    Router.replace(null, Router.routes.details, { text: 'Replaced', showButtons: false })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text {...testID('detailsText')}>{this.props.text}</Text>
        {this.props.showButtons &&
          <Button
            style={styles.button}
            title="Replace"
            onPress={this.onPressHandler}
            testId="Replace"
          />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
  },
})
