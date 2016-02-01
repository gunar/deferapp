#!/usr/bin/env node

// require('dotenv').load();

const PRODUCTION = process.env.NODE_ENV === 'production';
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

console.log('NODE_ENV=' + process.env.NODE_ENV);

// if (PRODUCTION) {
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(require('compression')());

if (!PRODUCTION) {
  const webpackCompiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    // watchDelay: 300,
    stats: { colors: true },
  }));
  app.use(require('webpack-hot-middleware')(webpackCompiler, {
    log: console.log,
  }));
}

require('./server/routes')(app);

app.listen(port, '0.0.0.0', function err(error) {
  if (error) {
    console.error('Unable to listen for connections', error);
    process.exit(1);
  }
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
