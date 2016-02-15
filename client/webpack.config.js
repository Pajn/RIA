const path = require('path');
const OfflinePlugin = require('offline-plugin');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

var config = {
  debug: !production,
  devtool: production ? '' : 'source-map',
  entry: {
    js: ['babel-polyfill', './app/app'],
    html: './app/index.html',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules\/(?!raxa-common)/,
        loaders: [
          'react-hot',
          'babel?' + JSON.stringify({
            presets: [
              require.resolve('babel-preset-react'),
              require.resolve('babel-preset-es2015'),
              require.resolve('babel-preset-stage-1'),
            ],
            //plugins: production
            //  ? ['transform-react-constant-elements', 'transform-react-inline-elements']
            //  : [],
          }),
         'ts',
       ],
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    modulesDirectories: ['node_modules', path.resolve('./node_modules')]
    //root: __dirname,
  },
  plugin: [
    new webpack.optimize.DedupePlugin(),
    new OfflinePlugin({
      caches: 'all',
      scope: '/',
      updateStrategy: 'hash',

      ServiceWorker: {
        output: 'sw.js',
      },

      AppCache: {
        directory: 'appcache/',
      }
    }),
  ],
};

if (production) {
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      test: /\.js$/,
    }),
  ]);
}

module.exports = config;
