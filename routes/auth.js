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
router.post('/register', function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('auth/register', {
      title: 'Register - AI Email & Compare',
      errorMessage: 'Please fill in all fields.',
    });
  }
  // Using plm to register user
  User.register(new User({ username }), password, function (err, user) {
    if (err) {
      console.error('Registration error:', err);

      return res.render('auth/register', {
        title: 'Register - AI Email & Compare',
        errorMessage: err.message || 'Error creating account. Try again.',
      });
    }

    // Auto login after successful registration
    passport.authenticate('local')(req, res, function () {
      res.redirect('/'); 
    }); 
  });
});

/* GET : Login page */
router.get('/login', function (req, res) {
  res.render('auth/login', {
    title: 'Login - AI Email & Compare',
  });
}); 

/* POST : handle user login */
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
  }),
  function (req, res) {
    res.redirect('/');
  }
);

module.exports = router;