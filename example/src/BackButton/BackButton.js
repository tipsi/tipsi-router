import React, { PureComponent } from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import testID from '../testID'

export default class BackButton extends PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  render() {
    if (this.props.index === 0) {
      return null
    }

    return (
      <TouchableOpacity
        {...testID('backButton')}
        style={styles.button}
        onPress={this.props.onPress}>
        <Image style={styles.icon} source={require('./img/back_button_icon.png')} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 35,
  },
  icon: {
    marginHorizontal: 7,
  },
})
