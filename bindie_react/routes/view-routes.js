var express = require('express');
var router = express.Router();
var path = require('path');
var url = require('url');

/* GET home page. */
router.get('/main', function (req, res, next) {
  res.render('index', { title: 'Bindie' });
});

router.get('/sample', function (req, res) {
  console.log(req.headers);

  if (req.headers.referer) {
    console.log(`REFERER: ${req.headers.referer}`);
    let pathname = url.parse(req.headers.referer).pathname;
    console.log(`PATHNAME: ${pathname}`);

    if (pathname == "/main") res.sendFile(path.join(__dirname, '0956.ogg'));
    else res.end("NO DEBERIAS ESTAR AQUI");
  } else {
    res.end("NO DEBERIAS ESTAR AQUI");
  }
});

module.exports = router;
