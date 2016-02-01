const express = require('express');
// bodyParser = require('body-parser'),
// // config = require('../../config'),
// db = require('../models'),
const router = new express.Router();

module.exports = router;

// Constants

// Parse POST data as JSON
// router.use(bodyParser.json());

// Ensure user is logged in for all routes in this file
// router.all('/'+'*', auth.ensureLogged);


/**
 * @api {GET} /api/users Returns all users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    [{ "id": "1", "isAdmin": "true", "name": "Keenahn Jung", "phone": "+162888886039", "email": 'some@email.com', "avatar":""https"://some.url/photo.jpg", "greeting": "https"://..../hello.mp3" }, {...}, ...]
 *
 * @apiUse NotLoggedIn
 * @apiUse NotAuthorized
 */
router.get('/entries', function getEntries(req, res) {
  const data = {
    page: 0,
    entries: [
      {
        id: 1,
        tags: ['xmas', 'gift'],
        value: -100,
        group: 1,
      },
      {
        id: 2,
        tags: ['xmas', 'other stuff'],
        value: -25,
        group: 1,
      },
      {
        id: 3,
        tags: ['shopping'],
        value: -30,
      },
    ],
    balance: 1024.12,
    tags: {
      xmas: -125,
      gift: -100,
      'other stuff': -25,
      shopping: -30,
    },
  };

  setTimeout(() => { res.send(data) }, 500);

});
