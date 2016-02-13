var passport = require('passport'),
    mongoose = require('mongoose'),
    express = require('express');

var user = require('../controllers/user');

var Log = mongoose.model('Log');

var router = express.Router();

router.get('/auth/', passport.authenticate('twitter'), user.signin);
router.get('/auth/callback', (req, res, next) => {
  passport.authenticate('twitter', (err, user, info) => {
    if (err) { console.log(err); return next(err); }
    if (!user) { return res.redirect('/'); }

    if (user.new) {
      Promise.resolve(Log.create({
        type: 'user_signed_in',
        data: {
          uid: user.uid,
          referer: req.session.referer,
        }
      })).catch(e => logger.error('DB Log error:', e));
    } else {
      Promise.resolve(Log.create({
        type: 'user_logged_in',
        data: {
          uid: user.uid,
          referer: req.session.referer,
        }
      })).catch(e => logger.error('DB Log error:', e));
    }


    req.logIn(user, {}, err => {
      if (err) { return next(err); }
      return res.redirect('/');
    });

  })(req, res, next);
});

module.exports = router;
