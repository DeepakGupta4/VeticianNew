const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-get-random-values',
};
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;