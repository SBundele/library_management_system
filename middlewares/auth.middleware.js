const adminAuth = (req, res, next) => {
  // Assuming the user's role is stored in `req.user`
  if (req.user && req.user.role === "admin") {
    next(); // Allow access
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};


module.exports = {adminAuth}