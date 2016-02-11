#!/bin/env node

console.log(process.version);

const ENV = process.env.NODE_ENV || 'development';
const IP = process.env.OPENSHIFT_NODEJS_IP ||
           process.env.OPENSHIFT_INTERNAL_IP ||
           '0.0.0.0';
const PORT = process.env.PORT ||
             process.env.OPENSHIFT_NODEJS_PORT ||
             process.env.OPENSHIFT_INTERNAL_PORT ||
             3000;
console.log('NODE_ENV=' + ENV);

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const config = require('./config')[ENV];
mongoose.connect(config.db, config.db_options || {});
config.load_models();
const logger = require('./logger')(config.logs_dir, 'server', 'info');

const app = express();
const MongoStore = require('connect-mongo')(session);
const Log = mongoose.model('Log');

require('./server/init.passport')(passport, config);
app.use(require('compression')());
app.use(session({
	saveUninitialized: false, // don't create session until something stored
	resave: false, //don't save session if unmodified
	secret: 'all your base are belong to us.',
	store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./dist'));
// DB Log Middleware.
app.use(function(req, res, next) {
  Log.create({
    type: 'request',
    data: {
      uid: req.user.id || null,
      ip: req.ip,
      method: req.method,
      url: req.originalUrl }
    })
    .catch(function(e) {
      logger.error('DB Log error:', e);
    });
  next();
});
app.use('/api/', require('./server/api/user'));
app.use('/api/', require('./server/api/tweet'));
app.use(require('./server/routes/user'));

if (ENV === 'development') {
  logger.debug('Using webpack-dev-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config');

  const webpackCompiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    // watchDelay: 300,
    stats: { colors: true },
  }));
  app.use(require('webpack-hot-middleware')(webpackCompiler, {
    log: logger.info,
  }));
}

// if (ENV !== 'development') {
  var crawler = require('./crawler')(mongoose);
  crawler.each(function (user) {
      // this functions consumes the Highland stream
    });
// }


app.listen(PORT, IP, function err(error) {
  if (error) {
    logger.error('Unable to listen for connections', error);
    process.exit(1);
  }
  logger.debug('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT, PORT);
});
