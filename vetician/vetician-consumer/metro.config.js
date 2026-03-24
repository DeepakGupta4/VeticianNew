const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-get-random-values',
};
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Stub native-only packages when bundling for web
const nativeOnlyModules = [
  'react-native-maps',
];

const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && nativeOnlyModules.some((m) => moduleName === m || moduleName.startsWith(m + '/'))) {
    return { type: 'empty' };
  }
  if (originalResolver) return originalResolver(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
