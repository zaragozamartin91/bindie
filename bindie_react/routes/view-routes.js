const express = require('express');
const router = express.Router();
const path = require('path');
const GlobalConfig = require('../GlobalConfig');
const mongoose = require('mongoose');

/* GET home page. */
router.get(GlobalConfig.mainPath, (req, res) => {
  if (req.session.uid) return res.render('index', { title: 'Bindie' });
  else return res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar sesion' });
});

router.post('/login', (req, res) => {
  let User = mongoose.model('User');
  let email = req.body.email || "";
  let pass = req.body.password || "";

  User.findOneByEmail(email, (err, user) => {
    if (err) {
      res.error(`Error al buscar el usuario ${email}`);
      return res.redirect('back');
    }

    if (user) {
      let isValid = user.authenticate(pass);
      if (isValid) {
        req.session.uid = user._id;
        return res.redirect(GlobalConfig.mainPath);
      }

      res.error(`Password invalido`);
      return res.redirect('back');
    }

    res.error(`No se encontro al usuario ${email}`);
    return res.redirect('back');
  });
});

module.exports = router;
