var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/main', function (req, res, next) {
  res.render('index', { title: 'Bindie' });
});

module.exports = router;
