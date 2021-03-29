module.exports = {
    type: 'react-component',
    npm: {
      esModules: true,
      umd: {
        global: 'VideoLooper',
        externals: {
          react: 'React'
        }
      }
    }
  }module.exports = require('babel-jest').createTransformer({
    presets: ['@babel/env', '@babel/react'],
    plugins: ['@babel/proposal-class-properties']
  })