const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add asset extensions to ensure all image formats are included
config.resolver.assetExts.push('avif');

module.exports = withNativeWind(config, { input: './app/globals.css' })