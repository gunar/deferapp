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
    media,
  };
};

const getTweetsByTags = (uid, tags, from_tid) => {
  from_tid = from_tid || 0;

  const match = { 'uid': uid };
  if (typeof tags === 'object' && tags.length) {
    match['tags'] = { $all: tags };
  } else {
    match['tags'] = { $nin: ['archived'] };
  }
  if (from_tid > 0) {
    match['tid'] = { $lt: Number(from_tid) };
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
          .limit(PAGE_LENGTH)
          .exec();
};

const visitorTweets = (tag, fromTid) => {
  if (fromTid && fromTid > 0) {
    // Return empty if asks for 2nd page in visitor mode
    return { data: [], visitor: true };
  }
  const data = [
    {
      tid: 1,
      tags: [],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'Hi and welcome to FavBin!',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/620964435541233664/5YE8s2Di_normal.jpg',
        screen_name: 'favbin',
        name: 'FavBin',
      },
      url: [],
      media: [],
    },
    {
      tid: 2,
      tags: ['archived'],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'Here are your archived tweets',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/620964435541233664/5YE8s2Di_normal.jpg',
        screen_name: 'favbin',
        name: 'FavBin',
      },
      url: [],
      media: [],
    },
  ];

  return { data, visitor: true };
};

api.get('/tweet/:from_tid',
  function (req, res, next) {
    if (!req.user) {
      // Default tweets for not logged user
      res.json(visitorTweets('inbox', req.params.from_tid));
      return;
    }
    getTweetsByTags(req.user.uid, [], req.params.from_tid)
      .then(docs => {
        // TODO: filter out tweets with no links
        res.json({data: docs.map(unwindTweet)});
      }, err => {
        res.status(500).json({message: err});
      });
});

api.get('/tweet/:tags/:from_tid',
  function (req, res, next) {
    if (!req.user) {
      // Default tweets for not logged user
      res.json(visitorTweets('archived', req.params.from_tid));
      return;
    }
    const tags = req.params.tags.split(',');
    getTweetsByTags(req.user.uid, tags, req.params.from_tid)
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
