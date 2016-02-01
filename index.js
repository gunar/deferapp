#!/usr/bin/env node

const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
console.log('NODE_ENV=' + ENV);

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const config = require('./config')[ENV];
mongoose.connect(config.db);
config.load_models();
// const logger = require('./logger')(config.log, service);

const app = express();
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

if (ENV === 'development') {
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

app.listen(PORT, '0.0.0.0', function err(error) {
  if (error) {
    console.error('Unable to listen for connections', error);
    process.exit(1);
  }
  console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT, PORT);
});
