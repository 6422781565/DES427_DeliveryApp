module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        [
            '@babel/plugin-transform-private-methods',
            {
              loose: true,
            },
          ],
        [
          'module:react-native-dotenv',
          {
            moduleName: '@env',
            path: '.env',
            safe: false,
            allowUndefined: true,
          },
        ],
      ],
    };
  };
  
  
  
  