const path = require('path');

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
    noInfo: false
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
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: resolve('node_modules'),
      },
    ],
  },
};

module.exports = config;
