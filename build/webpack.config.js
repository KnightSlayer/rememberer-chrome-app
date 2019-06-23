const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');


const __DEV__  = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');

const config = {
  mode: process.env.NODE_ENV,
  entry: {
    main: [
      path.resolve(srcDir, 'pages', 'Main.svelte'),
    ],
    background: [
      path.resolve(srcDir, 'background', 'background.js'),
    ]
  },
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  resolve: {
    modules: [
      srcDir,
      'node_modules',
    ],
    extensions: ['.js', '.svelte', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  plugins: [
    new WebpackNotifierPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.DefinePlugin({
      __DEV__,
      __PROD__,
    })
  ],
  watch: true,
  watchOptions: {
    ignored: [/dist/, /node_modules/],
  },
  devtool: __PROD__ ? false: 'source-map',
};


module.exports = config;
