var mongoose = require('mongoose'),
    User = mongoose.model('User');

var admins = [10417972, 2710378388];

module.exports = {
  signin: function(req, res) { },
  authCallback: function(req, res, next) {
    res.json(req);
  },
  isAdmin: function(req, res, next) {
    var uid = req.user && req.user.uid || 0;
    if (uid && admins.indexOf(req.user.uid) > -1) {
      return next();
    }
    return res.sendStatus(404);
  }
};
