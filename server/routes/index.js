const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const analytics = require('../analytics.js');

const index = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');
const indexVisitor = index.replace('/*gacreate*/', `ga('create', '${analytics.tid}', 'auto')`);

router.get('/', (req, res, next) => {
  if (!req.user) {
    return res.send(indexVisitor);
  }
  const indexUser = index.replace('/*gacreate*/', `ga('create', '${analytics.tid}', 'auto', {'userId': '${req.user.uid}'})`);
  return res.send(indexUser)
});

module.exports = router;
