var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');

/* GET : register page */
router.get('/register', function (req, res) {
  res.render('auth/register', {
    title: 'Register - AI Email & Compare',
  });
});

/* POST : handle user registration */


/* GET : Login page */
router.get('/login', function (req, res) {
  res.render('auth/login', {
    title: 'Login - AI Email & Compare',
  });
}); 

/* POST : handle user login */