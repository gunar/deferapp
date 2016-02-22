var mongoose = require('mongoose'),
    TwitterStrategy = require('passport-twitter').Strategy;

var User = mongoose.model('User');

module.exports = function(passport, config) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

  passport.authOnly = function(req, res, next) {
    if (!req.isAuthenticated())
      res.redirect('/auth');
    else {
      next();
      req.session.touch()
    }
  };

  passport.use('twitter', new TwitterStrategy({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL,
    },
    function(token, tokenSecret, profile, done) {
      // Check if user already exists.
      User.findOne({ 'uid': parseInt(profile.id) }, function (err, user) {
        if (err) { return done(err); }
        // Create new user.
        if (!user) {

          user = new User({
            uid: profile._json.id,
            name: profile.displayName,
            username: profile.username,
            twitter: profile._json,
            tokens: {key: token, secret: tokenSecret},
            avatar: profile._json.profile_image_url_https
          });
          user.save(function (err) {
            if (err) console.log(err);
            user.new = true;
            return done(err, user);
          });
        }
        // Refresh user info.
        else {

          user.update({
            uid: profile._json.id,
            name: profile.displayName,
            username: profile.username,
            twitter: profile._json,
            tokens: {key: token, secret: tokenSecret},
            avatar: profile._json.profile_image_url_https
          }, function(err) {
            user.new = false;
            return done(err, user);
          });
        }
      });
    }
  ));

};
