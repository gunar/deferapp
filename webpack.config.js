const path = require('path');
const webpack = require('webpack');
const PRODUCTION = process.env.NODE_ENV === 'production';

const config = {
  entry: ['./client/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve: {
  //   alias: {
  //     'react': path.join(__dirname, 'node_modules', 'react')
  //   },
    extensions: ['', '.js', '.jsx'],
  },
  // resolveLoader: {
  //   'fallback': path.join(__dirname, 'node_modules')
  // },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'client'), exclude: /node_modules/},
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
    ],
  },
};

if (PRODUCTION) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
} else {
  // Replace config.plugins
  config.devtool = 'eval';
  config.plugins = [new webpack.HotModuleReplacementPlugin()];
  config.entry = [
    // 'webpack-dev-server/client?http://localhost:3000',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    'webpack/hot/only-dev-server',
    ...config.entry,
  ];
}

module.exports = config;
