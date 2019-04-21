const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: './docs/main',
  output: {
    filename: '[name].[hash:8].js',
    path: path.join(__dirname, './docs/build'),
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
      {
        test: /\.styl(us)?$/,
        use: ['vue-style-loader', 'css-loader', 'stylus-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new HtmlWebpackPlugin({ template: 'docs/index.html' }),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['docs/build'] }),
  ],
};

module.exports = config;
