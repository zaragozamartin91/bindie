var express = require('express');
var router = express.Router();

var userController = require('../controllers/user.server.controller');

/* GET users listing. */
router.get('/', userController.list);

module.exports = router;