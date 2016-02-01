var serveStatic = require('serve-static');
var express = require('express');

module.exports = function router(app) {

  app.use(serveStatic('./dist'));
  // app.use(express.static(__dirname + '/dist'));

  // Store user session in request for further use
  // app.use(function(req,res,next){
  //   if (req.isAuthenticated())
  //     res.locals.user = req.user;
  //   next();
  // });

  app.use('/api', require('./api'));

  // app.get('/', function (req, res) {
  //   if (req.isAuthenticated())
  //     res.render('dash');
  //   else
  //     res.render('index');
  // });

  app.get('*', function (req, res) {
    res.sendFile('dist/index.html', {root: '.'});
  });

};
