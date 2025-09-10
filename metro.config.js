const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TurboModules
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

module.exports = config;
