var passport = require('passport'),
    mongoose = require('mongoose'),
    express = require('express');

var user = require('../controllers/user');

var router = express.Router();

router.get('/auth/', passport.authenticate('twitter'), user.signin);
router.get('/auth/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));

module.exports = router;
