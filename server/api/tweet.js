const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const fetch = require('isomorphic-fetch');
const URL = require('url');
const unshortener = require('unshortener');

const User = mongoose.model('User');
const TagList = mongoose.model('TagList');
const Tweet = mongoose.model('Tweet');
const Log = mongoose.model('Log');
const api = express.Router();

const parse = require('../parse.js');
const visitorTweets = require('./visitorTweets.js');

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


// TODO: This function is named uncorrectly
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
    allowScript: t.tweet.allowScript || false,
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

  return Promise.resolve(
    TagList
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
      .exec()
  );
};

const sendTweets = (res, uid, tags, from_tid) => {
  tags = tags || [];
  from_tid = from_tid || 0;

  getTweetsByTags(uid, tags, from_tid)
  .then(docs => res.json({data: docs.map(unwindTweet)}))
  .catch(err => {
    res.status(500).json({message: err})
    logger.error(err);
  });

};

// TODO: Move all visitor routes to a single file

api.get('/tweet/:from_tid', (req, res, next) => {
  if (!req.user) {
    // Default tweets for not logged user
    return res.json(visitorTweets('inbox', req.params.from_tid));
  }
  return sendTweets(res, req.user.uid, [], req.params.from_tid);
});

api.get('/tweet/:tags/:from_tid', (req, res, next) => {
  if (!req.user) {
    // Default tweets for not logged user
    return res.json(visitorTweets('archived', req.params.from_tid));
  }
  const tags = req.params.tags.split(',');
  return sendTweets(res, req.user.uid, tags, req.params.from_tid);
});

api.get('/goto/:tid/?', passport.authOnly,
  function (req, res, next) {
    Tweet
      .findOne({tid: req.params.tid}).exec()
      .then(t => {
        if (t.tweet.entities && t.tweet.entities.urls && t.tweet.entities.urls.length) {
          var url = URL.parse(t.tweet.entities.urls[0].expanded_url);
          res.redirect(301, url.href);
        }
      });
  }
);

api.get('/fetch/:tid/?', //passport.authOnly,
  function (req, res, next) {
    if (!req.user) {
      // Visitor
      const tid = req.params.tid;
      const visitorURLs = [
        'http://gunargessner.com',
        'https://medium.com/i-m-h-o/stop-trying-to-be-funny-on-twitter-150186463d91#.bosdzckfn',
        'http://www.leokewitz.com',
        'http://www.leokewitz.com',
      ];
      const url = visitorURLs[tid-1];
      fetch(url)
        .then(response => response.text())
        .then(html => res.send(html.replace('<head>', '<head><base href="'+url+'" target="_blank">')))
        .catch(e => logger.error(e));

      return;
    }
    // var fetch = rp.defaults({followAllRedirects: true});
    Tweet
      .findOne({tid: req.params.tid}).exec()
      .then(t => {
        if (t.tweet.entities && t.tweet.entities.urls && t.tweet.entities.urls.length) {
          var url = URL.parse(t.tweet.entities.urls[0].expanded_url);

          unshortener.expand(url.href, (err, expandedURL) => {
            if (err) return logger.error(err);

            // Test for youtube URL
            const yt = parse.getYouTubeID(expandedURL.href);
            if (yt) {
              return res.send('<style>'+parse.iframeCSS+'</style><iframe height="100%" src="https://www.youtube.com/embed/'+yt+'?rel=0&autoplay=1" allowfullscreen></iframe>');
            }

            fetch(expandedURL.href)
              .then(response => response.text())
              .then(html => res.send(html.replace('<head>', '<head><base href="'+expandedURL.href+'" target="_blank">')))
              .catch(e => logger.error(e));

          });


        } else {
          res.send('No urls on this tweet.');
        }
      });
});

api.post('/tweet/:tags/:tid', //passport.authOnly,
  function (req, res, next) {
    if (!req.user) {
      // Visitor
      return res.sendStatus(200);
    }
    const tags = req.params.tags.split(',');

    if (tags.indexOf('archived') > -1) {
      Promise.resolve(Log.create({
        type: 'user_archived_tweet',
        data: {
          uid: req.user.uid,
          tid: req.params.tid,
        }
      })).catch(e => logger.error('DB Log error:', e));
    }


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

api.delete('/tweet/:tags/:tid', //passport.authOnly,
  function (req, res, next) {
    if (!req.user) {
      // Visitor
      return ;res.sendStatus(200);
    }
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
