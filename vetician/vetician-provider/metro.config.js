const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-get-random-values',
  'react-native-reanimated': path.resolve(__dirname, 'node_modules/react-native-reanimated'),
};
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = withNativeWind(config, { input: './global.css' });
