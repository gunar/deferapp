const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const Log = mongoose.model('Log');
const route = express.Router();

const ENV = process.env.NODE_ENV || 'development';

route.post('/log/open_reader', (req, res, next) => {
  res.sendStatus(200);
  if (!req.user) {
    // Visitor
    Promise.resolve(Log.create({
      type: 'user_opened_reader',
      data: {
        uid: 0,
      }
    })).catch(e => logger.error('DB Log error:', e));
  }
  const url = req.body && req.body.url;
  const tid = req.body && req.body.tid;
  if (url) {
    Promise.resolve(Log.create({
      type: 'user_opened_reader',
      data: {
        uid: req.user.uid,
        url,
        tid,
      }
    })).catch(e => logger.error('DB Log error:', e));
  }
});

module.exports = route;
