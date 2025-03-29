import { Platform } from 'react-native';

// Web-specific MapView
if (Platform.OS === 'web') {
  module.exports = require('react-native-web-maps');
  exports.PROVIDER_GOOGLE = require('react-native-maps').PROVIDER_GOOGLE;
} else {
  // Native MapView
  module.exports = require('react-native-maps');
}
