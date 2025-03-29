module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          'react-native-maps': './src/web/compat/react-native-maps',
          'react-native/Libraries/Utilities/codegenNativeCommands': './src/web/compat/codegenNativeCommands',
        },
      }],
    ],
  };
};
