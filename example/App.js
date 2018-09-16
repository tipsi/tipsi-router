import React, { Component } from 'react'
import Router, { createStackNavigation } from 'tipsi-router'
import Home from './src/Home'
import Details from './src/Details'
import BackButton from './src/BackButton'

const routes = {
  home: {
    path: 'home',
    component: Home,
  },
  details: {
    path: 'details',
    component: Details,
  },
}

const backgroundColor = '#EBEBEB'

export default class App extends Component {
  render() {
    const defaultRouteConfig = {
      navigationBar: {
        backgroundColor,
        renderLeft: (route, props) => (
          <BackButton index={props.scene.index} onPress={Router.pop} />
        ),
      },
    }
    return (
      createStackNavigation('home', routes, false, defaultRouteConfig)
    )
  }
}
