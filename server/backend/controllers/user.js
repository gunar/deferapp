var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {
  signin: function(req, res) { },
  authCallback: function(req, res, next) {
    res.json(req);
  },
};
