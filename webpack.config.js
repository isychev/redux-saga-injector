const path = require('path');
const webpack = require('webpack');
const srcPath = path.join(__dirname, '/src/');
const distPath = path.join(__dirname, '/dist/');
module.exports = {
  entry: {
    app: path.join(__dirname, './main.js'),
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: "index.js",
  },
  externals:{
    'redux-saga':'redux-saga',
    'react':'react',
    'redux-saga/effects':'redux-saga/effects',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude:path.resolve(__dirname, "node_modules"),
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true,
              plugins: [
                'babel-plugin-transform-class-properties',
                'babel-plugin-syntax-dynamic-import',
                [
                  'babel-plugin-transform-object-rest-spread',
                  {
                    useBuiltIns: true // we polyfill Object.assign in src/normalize.js
                  },
                ],
              ],
              presets: [
                [
                  'babel-preset-env',
                  {
                    modules: false,
                    targets: {
                      ie9: true,
                    },
                    uglify: true,
                  },
                ],
              ],
            },
          },
        ],
      }
    ]
  }
}