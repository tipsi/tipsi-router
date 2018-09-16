// @description There is a 0.57 + metro-bundler issue
// @see https://github.com/facebook/react-native/issues/19955#issuecomment-421295617
import applyDecoratedDescriptor from '@babel/runtime/helpers/esm/applyDecoratedDescriptor'
import initializerDefineProperty from '@babel/runtime/helpers/esm/initializerDefineProperty'

import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'

// eslint-disable-next-line
Object.assign(babelHelpers, { applyDecoratedDescriptor, initializerDefineProperty })

const App = require('./App').default

AppRegistry.registerComponent(appName, () => App)
