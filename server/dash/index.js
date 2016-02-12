// TODO check if this is OK is production
require('babel-register');

var express = require('express');
var mongoose = require('mongoose');

// var User = mongoose.model('User');
var api = express.Router();

var user = require('../controllers/user');

var React = require('react');
var ReactDOM = require('react-dom/server');
var LoginButton = require('../../client/components/LoginButton');

api.get('/', user.isAdmin, function (req, res, next) {
  var c = LoginButton.default();
  res.send(ReactDOM.renderToString(c));
});

module.exports = api;
