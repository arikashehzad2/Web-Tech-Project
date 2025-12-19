// Middleware: allow only admin access
module.exports = function (req, res, next) {
  const userEmail = req.session.userEmail; // assuming you store logged-in email in session
  if (userEmail !== "admin@shop.com") {
    return res.send("Access denied. Admins only.");
  }
  next();
};
