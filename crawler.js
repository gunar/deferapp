module.exports = function crawler(mongoose) {
  var _ = require('highland'),
      Twitter = require('twitter'),
      Q = require('q'),
      winston = require('winston');

  // Load global configs.
  var env = process.env.NODE_ENV || 'development',
      service = 'crawler',
      config = require('./config')[env],
      logger = require('./logger')(config.log, service, 'info');

  // Configurations
  var MINIMUM_INTERVAL_MINS = 1;

  // Constants
  var MINIMUM_INTERVAL = MINIMUM_INTERVAL_MINS*60*1000;
  var LIMIT_REACHED = 30;
  var COULD_NOT_AUTH = 32;
  var NO_TWEET = 12;

  // Connect to MongoDB
  mongoose.Promise = Q.Promise;
  // logger.info('Connecting to db ' + config.db);
  // mongoose.connect(config.db);

  // Load Models
  config.load_models();
  var User = mongoose.model('User');
  var Tweet = mongoose.model('Tweet');
  var TagList = mongoose.model('TagList');


  // Clear console
  // console.log('\033[2J');
  var error = function (err) { logger.error(err); };

  var getInterval = function (int) {
    return (new Date()) - int;
  };
  var getUser = function (push, next) {
    var query = { $or: [
      { 'lastCrawl.date': { $lt: getInterval(MINIMUM_INTERVAL) } },
      { 'lastCrawl.date': { $eq: null } }
    ] };
    var fields = 'uid tokens';
    var update = { $set: { lastCrawl: { date: new Date(), active: true } } };
    var options = {
      sort: { 'lastCrawl.date' : 1 },
      new: true
    };
    User.findOneAndUpdate(query, update, options).select(fields).lean().exec().then(function (user) {
      if (user) {
        logger.debug(user.uid + ' Processing user');
        user.rate_limit = 1;
        push(null, user);
        next();
      } else {
        logger.info('No more users to be processed. Sleeping 10s.');
        setTimeout(next, 10*1000);
      }
    }).catch(function (err) {
      push(err, null);
    });
  };

  var get = function (user, url, options) {
    if (user.rate_limit < 1) {
      logger.info(user.uid + ' Limit reached.');
      return _(function (push, next) {
        push({ uid:user.uid, code: LIMIT_REACHED });
      });
    }
    user.rate_limit--;
    return user.twitterGet(url, options);
  };

  var getClient = function (user) {
    var client = new Twitter({
      consumer_key: config.twitter.consumerKey,
      consumer_secret: config.twitter.consumerSecret,
      access_token_key: user.tokens.key,
      access_token_secret: user.tokens.secret
    });
    var twitterGet = _.wrapCallback(client.get.bind(client));
    return { twitterGet: twitterGet, uid: user.uid };
  };

  var getRateLimit = function (user) {
    return get(user, 'application/rate_limit_status', { resources: 'favorites' }).map(function (data) {
      var remaining = data.resources.favorites['/favorites/list'].remaining;
      user.rate_limit = parseInt(remaining, 10);
      logger.debug(user.uid + ' still has ' + user.rate_limit + ' calls remaining.');
      return user;
    }).errors(function (err, push) {
      if (err[0]) err = err[0]; //Dunno why err is an array for TwitterAPI
      if (err && err.code && err.code == COULD_NOT_AUTH) {
        //message: 'Could not authenticate you.'
        err.uid = user.uid;
        push(err);
      } else {
        push(err);
      }
    });
  };

  var getRange = function (user) {
    var uid = user.uid;
    var query = { uid: user.uid };
    logger.debug(user.uid + ' Querying DB for tweets from user');

    return _(
      TagList
        .find(query)
        .sort('-tid')
        .skip(100)
        .limit(1)
        .lean()
        .exec()
        .then(function (tweet) {
          if (tweet && tweet[0] && tweet[0].tid) user.since_id = tweet[0].tid;
          return user;
        })
    );
  };

  var requestFavorites = function (user) {
    var options = { count: 200 };
    if (user && user.since_id) {
      options.since_id = user.since_id;
    }

    logger.debug(user.uid + ' Trying to request favs from user since_id ' + (options.since_id || 0));
    return get(user, 'favorites/list', options)
      .map(function (favs) {
        logger.info('Got ' + favs.length + 'favs');
        if (!favs.length) {
          return _(function (push, next) {
            push({ uid:user.uid, code: NO_TWEET });
          });
        }
        return _(favs.map(function (fav) {
          return { uid: user.uid, content: fav };
        }));
      }).merge();
  };

  var storeFav = function (tweet) {
    return _(
      Tweet
        .findOne({tid: tweet.content.id})
        .exec()
    ).flatMap(function (stored) {

      var newTweet;
      var tid = tweet.content.id;
      var uid = tweet.uid;

      if (!stored) {
        // Tweet not yet stored
        newTweet = new Tweet({
          tid: tid,
          tweet: tweet.content,
          parsed: {}
        });
        logger.silly('New tweet\t', + tid);

      } else {
        // Tweet already stored
        newTweet = stored;
        newTweet.tweet = tweet.content;
        logger.silly('Updating tweet ' + tid);
      }
      return _(newTweet.save().then(function () { return { uid: uid, tid: tid  }; }));
    });
  };

  var storeTagList = function (tweet) {
    return _(
      TagList
        .findOne({
          uid: tweet.uid,
          tid: tweet.tid,
        })
        .exec()
    ).flatMap(function (stored) {
      var newTagList;

      if (!stored) {
        newTagList = new TagList({
            uid: tweet.uid,
            tid: tweet.tid,
        });
        return _(
          newTagList
            .save()
            .then(
              function (tagList) {
                logger.silly('New tagList');
                return { uid: tagList.uid, tid: tagList.tid };
              }
            )
        );
      }

      logger.silly('TagList already exists');
      return _([{ uid: tweet.uid, tid: tweet.tid }]);
    });
  };


  var crawler = _(getUser)
    // { uid: Number, tokens: {} }
    .map(getClient)
    // { uid: Number, twitterGet: [Function] }
    .map(getRateLimit).parallel(1)
    // { uid: Number, twitterGet: [Function], rate_limit: Number };
    .flatMap(getRange)
    // { uid: Number, twitterGet: [Function], rate_limit: Number[, since_id: Number] };
    .map(requestFavorites).parallel(1)
    // [{ uid: Number, tweet: {} }, ...]
    .flatMap(storeFav)
    .flatMap(storeTagList)
    .errors(function (err, push) {
      if (err && err.uid && err.code) {
        push(null, err);
      } else {
        logger.error(err);
      }
    })
    .flatMap(function (user) {
      var query = { uid: user.uid };
      var errCode = user.code || 0;
      var update = { $set: { 'lastCrawl.error': errCode } };
      return _(User.update(query, update).exec());
    });

  console.log('Crawler running...');

  return crawler;

};
