const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided. Unauthorized access." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    if (decoded.role === "admin") {
      req.user = decoded; // Attach user data to request object
      next(); // Allow access
    } else {
      res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

const userAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { id } = req.params;

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided. Unauthorized access." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    if (decoded.role === "admin" || decoded.id === id) {
      // req.userId = decoded; // Attach user data to request object
      next(); // Allow access
    } else {
      res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = { adminAuth, userAdminAuth };
