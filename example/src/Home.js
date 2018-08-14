import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Router from 'tipsi-router'
import Button from './Button'
import BackButton from './BackButton'
import testID from './testID'

export default class componentName extends Component {
  componentWillMount = () => {
    Router.setTitle('Home')
  }

  onPushHandler = () => {
    Router.push(null, Router.routes.details, { text: 'Push details' })
  }

  onModalHandler = () => {
    const config = {
      navigationBar: {
        backgroundColor: '#ebebeb',
        title: 'Modal',
        renderLeft: (route, props) => (
          <BackButton index={props.scene.index} onPress={Router.dismissModal} />
        ),
      },
    }
    Router.showModal(
      null,
      Router.routes.details,
      { config, text: 'Modal details', showButtons: false }
    )
  }

  render() {
    return (
      <View style={styles.container} {...testID('Home')}>
        <Button style={styles.button} title="Push" onPress={this.onPushHandler} testId="Push" />
        <Button style={styles.button} title="Modal" onPress={this.onModalHandler} testId="Modal" />
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
