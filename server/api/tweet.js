const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const TagList = mongoose.model('TagList');
const api = express.Router();

var ENV = process.env.NODE_ENV || 'development';
var PAGE_LENGTH = 20

const unwindTweet = t => {
  return Object.assign(t.tweet.tweet,
    { tid: t.tid, uid: t.uid, tags: t.tags });
};

api.get('/tweet/:page', passport.authOnly,
  function (req, res, next) {
    TagList
      .aggregate({
        $lookup: {
          from: 'tweets',
          localField: 'tid',
          foreignField: 'tid',
          as: 'tweet'
        }
      })
      .unwind('tweet')
      .match({ 'uid': req.user.uid })
      .sort('-tid')
      .skip(parseInt(req.params.page)*PAGE_LENGTH)
      .limit(PAGE_LENGTH)
      .exec(function (err, docs){
        if (err) res.status(500).json({message: err});
        else {
          //TODO filter fields before sending to frontend
          // filter out tweets with no links
          res.json({data: docs.map(unwindTweet)});
        }
      });
});

api.get('/tweet/archive/:page', passport.authOnly,
  function (req, res, next) {
    TagList
      .aggregate({
        $lookup: {
          from: 'tweets',
          localField: 'tid',
          foreignField: 'tid',
          as: 'tweet'
        }
      })
      .unwind('tweet')
      .match({ 'uid': req.user.uid, 'tags': { $in: ['archived'] } })
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
    TagList
      .findOne({tid: req.params.tid, uid: req.user.uid})
      .exec(function (err, tweet) {
        if (err) res.status(500).json({message: err});
        else if (!tweet) res.json({name: "NotFound", message: "Tweet not found."});
        else {
          tweet.tags.starred.push('archived');
          tweet.save(function (err, tweet) {
            if (err) res.status(500).json({message: err});
            res.json({data: tweet});
          });
        }
      });
});

api.post('/tweet/unarchive/:tid', passport.authOnly,
  function (req, res, next) {
    TagList
      .findOne({tid: req.params.tid, uid: req.user.uid})
      .exec(function (err, tweet) {
        if (err) res.status(500).json({message: err});
        else if (!tweet) res.json({name: "NotFound", message: "Tweet not found."});
        else {
          tweet.tags = tweet.tags.filter(t => t != 'archived');
          tweet.save(function (err, tweet) {
            if (err) res.status(500).json({message: err});
            res.json({data: tweet});
          });
        }
      });
});

module.exports = api;
