const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const TagList = mongoose.model('TagList');
const api = express.Router();

const ENV = process.env.NODE_ENV || 'development';
const PAGE_LENGTH = 20;

const filterObject = (obj, keys) =>
  Object.keys(obj)
    .filter(k => keys.indexOf(k) > -1)
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {})
    ;


const unwindTweet = t => {
  'use strict';
  const fullTweet = t.tweet.tweet;
  const tweet = filterObject(fullTweet, [
    'favorite_count',
    'retweet_count',
    'text',
    'created_at',
  ]);
  const user = filterObject(fullTweet.user, [
    'profile_image_url_https',
    'screen_name',
    'name',
  ]);

  let url = [];
  if (
    fullTweet.entities
    && fullTweet.entities.urls
    && fullTweet.entities.urls.length
  ) {
    url = fullTweet.entities.urls.map(u => u.expanded_url);
  }

  let media = [];
  if (
    fullTweet.entities
    && fullTweet.entities.media
    && fullTweet.entities.media.length
  ) {
    media = fullTweet.entities.media.map(m => m.media_url_https);
  }

  return {
    tid: t.tid,
    tags: t.tags,
    tweet,
    user,
    url,
    media
  };
};

const getTweetsByTags = (uid, tags, page) => {
  const match = { 'uid': uid };
  if (typeof tags === 'object' && tags.length) {
    match['tags'] = { $all: tags };
  } else {
    match['tags'] = { $nin: ['archived'] };
  }

  return TagList
          .aggregate({
            $lookup: {
              from: 'tweets',
              localField: 'tid',
              foreignField: 'tid',
              as: 'tweet',
            }
          })
          .unwind('tweet')
          .match(match)
          .sort('-tid')
          .skip(parseInt(page, 10) * PAGE_LENGTH)
          .limit(PAGE_LENGTH)
          .exec();
};

api.get('/tweet/:page', passport.authOnly,
  function (req, res, next) {
    getTweetsByTags(req.user.uid, [], req.params.page)
      .then(docs => {
        // TODO: filter out tweets with no links
        res.json({data: docs.map(unwindTweet)});
      }, err => {
        res.status(500).json({message: err});
      });
});

api.get('/tweet/:tags/:page', passport.authOnly,
  function (req, res, next) {
    const tags = req.params.tags.split(',');
    getTweetsByTags(req.user.uid, tags, req.params.page)
      .then(docs => {
        res.json({data: docs.map(unwindTweet)});
      }, err => {
        res.status(500).json({message: err});
      });
  }
);

api.post('/tweet/:tags/:tid', passport.authOnly,
  function (req, res, next) {
    const tags = req.params.tags.split(',');
    TagList
      .findOne({tid: parseInt(req.params.tid, 10), uid: req.user.uid})
      .exec(function (err, tweet) {
        if (err) res.status(500).json({message: err});
        else if (!tweet) res.json({name: "NotFound", message: "Tweet not found."});
        else {
          tweet.tags.push(...tags);
          tweet.save(function (err, tweet) {
            if (err) res.status(500).json({message: err});
            res.json({data: tweet});
          });
        }
      });
});

api.delete('/tweet/:tags/:tid', passport.authOnly,
  function (req, res, next) {
    const tags = req.params.tags.split(',');
    TagList
      .findOne({tid: req.params.tid, uid: req.user.uid})
      .exec(function (err, tweet) {
        if (err) res.status(500).json({message: err});
        else if (!tweet) res.json({name: "NotFound", message: "Tweet not found."});
        else {
          tweet.tags = tweet.tags.filter(t => tags.indexOf(t) == -1);
          tweet.save(function (err, tweet) {
            if (err) res.status(500).json({message: err});
            res.json({data: tweet});
          });
        }
      });
});

module.exports = api;
