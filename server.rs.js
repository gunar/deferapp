/*jshint loopfunc: true */

// Load global configs.
var env = process.env.NODE_ENV || 'development',
    service = 'server',
    config = require('./config')[env];
    logger = require('./logger')(config.log, service);


// Load Dependencies
var express = require('express'),
		mongoose = require('mongoose'),
		fs = require('fs'),
		passport = require('passport'),
		compression = require('compression'),
		serveStatic = require('serve-static'),
		session = require('express-session'),
		MongoStore = require('connect-mongo')(session),
    webpack = require('webpack'),
    webpackConfig = require("./webpack.config.js"),
    webpackCompiler = webpack(webpackConfig);

// Connect to MongoDB
logger.info('Connecting to db', config.db);
mongoose.connect(config.db);

// Load Models
config.load_models();

// Configure
require('./src/backend/init.passport')(passport, config);

// Create Server
var app = express();

// express/mongo session storage
app.use(compression());
app.use(session({
	saveUninitialized: false, // don't create session until something stored
	resave: false, //don't save session if unmodified
	secret: 'all your base are belong to us.',
	store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'jade');
app.set('views', __dirname + '/src/frontend/views');

if (env == 'development') {
  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    // watchDelay: 300,
    stats: { colors: true }
  }));
  app.use(require('webpack-hot-middleware')(webpackCompiler, {
    log: console.log
    // heartbeat: 10 * 1000
  }));

	app.use(function(req, res, next) { setTimeout(next, 500); }); //TODO: Remove
} else {
  logger.info('running webpack');
  webpackCompiler.run(function (err, stats) {
    if (err) throw(err);
    logger.info('webpack successful');
  });
}

// Statics
app.use(serveStatic(__dirname + '/www'));

// Load Routes
app.use('/api/', require('./src/backend/api/user'));
app.use('/api/', require('./src/backend/api/tweet'));
app.use(require('./src/backend/routes/user'));

app.get('/index', function (req, res) {
	res.render('index');
});
app.get('/', function (req, res) {
	if (req.isAuthenticated()) {
		res.render('dash');
	} else {
		res.render('index');
	}
});


// Run Server
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	logger.debug('Process ' + process.pid + ' listening at http://%s:%s', host, port);
});
