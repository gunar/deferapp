var express = require('express'),
    passport = require('passport'),
    mongoose = require('mongoose');

var Tweet = mongoose.model('Tweet'),
    api = express.Router();

var env = process.env.NODE_ENV || 'development';

var PAGE_LENGTH = 20;

api.get('/tweet/:page', passport.authOnly,
  function (req, res, next) {
    Tweet
      .find({'uids.starred': {$all: [req.user.uid]}})
      .sort('-tid')
      .skip(parseInt(req.params.page)*PAGE_LENGTH)
      .limit(PAGE_LENGTH)
      .exec(function (err, docs){
        if (err) res.status(500).json({message: err});
        else {
          //TODO filter fields before sending to frontend
          // filter out tweets with no links
          res.json({data: docs});
        }
      });
});

api.get('/tweet/archive/:page', passport.authOnly,
  function (req, res, next) {
    Tweet
      .find({'uids.archived': {$all: [req.user.uid]}})
      .sort('-tid')
      .skip(parseInt(req.params.page)*PAGE_LENGTH)
      .limit(PAGE_LENGTH)
      .exec(function (err, docs){
        if (err) res.status(500).json({message: err});
        else res.json({data: docs});
      });
});

api.post('/tweet/archive/:tid', passport.authOnly,
  function (req, res, next) {
    Tweet
      .findOne({tid: req.params.tid, 'uids.archived': {$all: [req.user.uid]}})
      .exec(function (err, tweet) {
        if (err) res.status(500).json({message: err});
        else if (!tweet) res.json({name: "NotFound", message: "Tweet not found."});
        else {
          tweet.uids.starred.push(tweet.uids.archived.pop(req.user.uid));
          tweet.save(function (err, tweet) {
            if (err) res.status(500).json({message: err});
            res.json({data: tweet});
          });
        }
      });
});

api.post('/tweet/unarchive/:tid', passport.authOnly,
  function (req, res, next) {
    Tweet
      .findOne({tid: req.params.tid, 'uids.starred': {$all: [req.user.uid]}})
      .exec(function (err, tweet) {
        if (err) res.status(500).json(err);
        else if (!tweet) res.json({name: "NotFound", message: "Tweet not found."});
        else {
          tweet.uids.archived.push(tweet.uids.starred.pop(req.user.uid));
          tweet.save(function (err, tweet) {
            if (err) res.status(500).json({message: err});
            res.json({data: tweet});
          });
        }
      });
});

module.exports = api;
