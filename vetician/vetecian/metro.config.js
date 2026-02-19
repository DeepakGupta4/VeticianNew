const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver for web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add resolver configuration for socket.io-client
config.resolver.alias = {
  ...config.resolver.alias,
};

// Resolve Node.js modules that don't exist in React Native
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;