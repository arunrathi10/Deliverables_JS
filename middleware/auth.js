function AuthenticationMiddleware(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // user is authenticated
  } else {
    return res.redirect('/auth/login'); // not authenticated
  }
}

module.exports = AuthenticationMiddleware;
