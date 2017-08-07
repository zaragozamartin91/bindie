var express = require('express');
var router = express.Router();
var path = require('path');
var GlobalConfig = require('../GlobalConfig');

/* GET home page. */
router.get(GlobalConfig.mainPath, function (req, res, next) {
  res.render('index', { title: 'Bindie' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Iniciar sesion' });
});

router.post('/login', function (req, res, next) {
  console.log(req.body);
  res.redirect('/main');
});

module.exports = router;
