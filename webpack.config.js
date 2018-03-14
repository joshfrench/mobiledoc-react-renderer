var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  }
};

// dev server
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(config, {
    devtool: 'inline-source-map',
    entry: './demo/index.js',
    devServer: {
      contentBase: './demo',
      stats: 'errors-only'
    }
  });
}

// production build
if (TARGET === 'build') {
  module.exports = merge(config, {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      })
    ]
  });
}
