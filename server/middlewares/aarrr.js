var express = require('express');
var mongoose = require('mongoose');

var Log = mongoose.model('Log');
var route = express.Router();

route.get('/', function(req, res, next) {
  var uid = req.user && req.user.id ? req.user.id : null;
  var visitor = (uid ? false : true);

  if (visitor) {
    // Set referer
    const hasReferer = req.headers && req.headers.referer && req.headers.referer != '' ? true : false;
    const referer = hasReferer ? req.headers.referer : '';
    const notOwnSite = !/deferapp.com/.test(referer);
    const firstVisit = !req.session.referer;

    if (firstVisit) {
      Promise.resolve(Log.create({
        type: 'user_landed',
        data: {
          referer: referer,
          ip: req.ip,
          url: req.originalUrl
        }
      })).catch(e => logger.error('DB Log error:', e));
    }

    req.session.referer = referer || 1;

  }
  


  next();

});

module.exports = route;
