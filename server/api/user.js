var express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose');

var User = mongoose.model('User'),
    api = express.Router();

api.get('/user/', passport.authOnly,
  function (req, res, next) {
    User
      .find({uid: req.user.uid})
      .exec(function(err, user) {
        if (err) res.status(500).json({message: err});
        else res.json({data: user});
      });
});

module.exports = api;
