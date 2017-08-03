var express = require('express');
var router = express.Router();
var path = require('path');
var GlobalConfig = require('../GlobalConfig');

/* GET home page. */
router.get(GlobalConfig.mainPath, function (req, res, next) {
  res.render('index', { title: 'Bindie' });
});

module.exports = router;
