import React, { PureComponent } from 'react'
import { TouchableOpacity, Text, ViewPropTypes, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import testID from '../testID'

export default class Button extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    testId: PropTypes.string,
    style: ViewPropTypes.style,
  }

  static defaultProps = {
    onPress: () => {},
    testId: '',
    style: {},
  }

  render() {
    const { title, onPress, style, testId } = this.props
    return (
      <TouchableOpacity {...testID(testId)} style={[styles.button, style]} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    backgroundColor: '#e3e3e3',
  },
})
