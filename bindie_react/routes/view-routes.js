var express = require('express');
var router = express.Router();
var path = require('path');
var url = require('url');

/* GET home page. */
router.get('/main', function (req, res, next) {
  res.render('index', { title: 'Bindie' });
});

router.get('/sample/:song', function (req, res) {
  console.log(req.headers);
  console.log(`SONG: ${req.params.song}`);

  if (req.headers.referer) {
    console.log(`REFERER: ${req.headers.referer}`);
    let pathname = url.parse(req.headers.referer).pathname;
    console.log(`PATHNAME: ${pathname}`);

    let songPath = path.join(__dirname, '..', 'songs', req.params.song);
    console.log(`SONG PATH: ${songPath}`);

    if (pathname == "/main") res.sendFile(songPath);
    else res.end("NO DEBERIAS ESTAR AQUI");
  } else {
    res.end("NO DEBERIAS ESTAR AQUI");
  }
});

module.exports = router;
