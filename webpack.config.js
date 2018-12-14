const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: './docs/main',
  output: {
    path: path.join(__dirname, './docs/build'),
    publicPath: 'docs/build/',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: resolve('node_modules'),
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};

module.exports = config;
