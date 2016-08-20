var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

var config = {
  entry: ['./src/index.js']
};

config.output = {
  path: path.join(__dirname, 'dist'),
  filename: 'index.js'
};

config.module = {
  loaders: [
    {
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }
  ]
};

// karma and friends
if (/^test/.test(TARGET)) {
  module.exports = merge(config, {
    devtool: 'inline-source-map',
    output: {
      devtoolModuleFilenameTemplate: '[resourcePath]',
      devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
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
