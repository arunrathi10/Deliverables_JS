var express = require('express');
var router = express.Router();

/* GET email page. */
router.get('/write', function(req, res, next) {
  res.render('email/write', { title: 'AI Email & Compare - Email' });
});


module.exports = router;
