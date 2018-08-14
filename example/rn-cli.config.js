const path = require('path')

const mapAppNodeModules = (memo, moduleName) => ({
  ...memo,
  [moduleName]: path.resolve(__dirname, `node_modules/${moduleName}`),
})

const extraAppNodeModules = [
  '@expo',
  'react-native',
].reduce(mapAppNodeModules, {})

module.exports = {
  extraNodeModules: extraAppNodeModules,
}
