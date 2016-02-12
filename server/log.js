var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');

var Log = mongoose.model('Log');
var route = express.Router();

route.use(function(req, res, next) {
  var uid = req.user && req.user.id ? req.user.id : null;
  Log.create({
    type: 'request',
    data: {
      uid: uid,
      ip: req.ip,
      method: req.method,
      url: req.originalUrl }
    })
    .catch(function(e) {
      logger.error('DB Log error:', e);
    });
  next();
});

module.exports = route;
