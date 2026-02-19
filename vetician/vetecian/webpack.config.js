const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add proxy for development to bypass CORS
  if (env.mode === 'development') {
    config.devServer = {
      ...config.devServer,
      proxy: {
        '/api': {
          target: 'https://vetician-backend.onrender.com',
          changeOrigin: true,
          secure: true,
          logLevel: 'debug'
        }
      }
    };
  }
  
  return config;
};