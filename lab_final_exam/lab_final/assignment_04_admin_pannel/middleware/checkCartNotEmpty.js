// middleware/checkCartNotEmpty.js

module.exports = function (req, res, next) {
  // If cart does not exist or is empty
  if (!req.session.cart || req.session.cart.length === 0) {
    // Redirect user back to menu page
    return res.redirect("/menu");
  }

  // Otherwise, continue to next middleware or route handler
  next();
};
