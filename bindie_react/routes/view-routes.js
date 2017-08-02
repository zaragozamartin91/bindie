var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/main', function (req, res, next) {
  res.render('index', { title: 'Bindie' });
});

router.get('/sample', function (req, res) {
  console.log(req.headers);
  console.log(`REFERER: ${req.headers.referer || "UNDEFINED"}`);
  res.sendFile(path.join(__dirname, '0956.ogg'));
});

module.exports = router;
