const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');


const __DEV__  = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

const entryPoints = {
  ['page.main']: [
    path.resolve(srcDir, 'pages', 'main', 'index.js'),
  ],
  ['src.background']: [
    path.resolve(srcDir, 'background', 'background.js'),
  ]
};

const PagesHtmlPlugin = new CopyPlugin(
  Object.keys(entryPoints).reduce( (res, entryKey) => {
    const [type, name] = entryKey.split('.');

    if (type === 'page') {
      res.push({
        from: path.resolve(srcDir, 'pages', name, `${name}.html`),
        to: path.resolve(distDir, 'pages', name, `${name}.html`),
      })
    }

    return res;
  }, [])
);

const config = {
  mode: process.env.NODE_ENV,
  entry: entryPoints,
  output: {
    path: distDir,
    filename: (chunkData) => {
      const [type, name] = chunkData.chunk.name.split('.');
      return type === 'page' ? `pages/${name}/${name}.js`: `${name}.js`;
    },
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
            // emitCss: true,
          }
        }
      },
      {
        test: /\.mjs$/,
        type: "javascript/auto",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  plugins: [
    PagesHtmlPlugin,
    new CopyPlugin([{
      from: path.resolve(srcDir, 'manifest.json'),
      to: path.resolve(distDir, 'manifest.json'),
    }, {
      from: path.resolve(srcDir, 'assets'),
      to: path.resolve(distDir, 'assets'),
    }]),
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
