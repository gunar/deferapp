#!/usr/bin/env node

const env = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
console.log('NODE_ENV=' + env);

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const config = require('./config')[env];
mongoose.connect(config.db);
config.load_models();
// const logger = require('./logger')(config.log, service);

const app = express();
const port = process.env.PORT || 3000;
const MongoStore = require('connect-mongo')(session);

require('./server/backend/init.passport')(passport, config);
app.use(require('compression')());
app.use(session({
	saveUninitialized: false, // don't create session until something stored
	resave: false, //don't save session if unmodified
	secret: 'all your base are belong to us.',
	store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/', require('./server/backend/api/user'));
app.use('/api/', require('./server/backend/api/tweet'));
app.use(require('./server/backend/routes/user'));
app.use(express.static('./dist'));

if (env === 'development') {
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

app.listen(port, '0.0.0.0', function err(error) {
  if (error) {
    console.error('Unable to listen for connections', error);
    process.exit(1);
  }
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
