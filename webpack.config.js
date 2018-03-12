const path = require('path');

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
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
