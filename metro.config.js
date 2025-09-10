const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TurboModules and react-native-gesture-handler
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Reset cache on every restart to avoid TurboModule cache issues
config.resetCache = true;

// Configure transformer for better compatibility
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    // Disable minification that can cause TurboModule issues
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Ensure gesture handler and other native modules are properly resolved
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-gesture-handler': require.resolve('react-native-gesture-handler'),
};

module.exports = config;
