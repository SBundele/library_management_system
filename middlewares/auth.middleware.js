const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Get token from the 'Authorization' header
  let token = req.headers.authorization?.split(" ")[1];

  // Check if token was provided
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token with the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload to request object
    req.user = decoded;
    next();
  } catch (error) {
    // If token is invalid, return error response
    res.status(400).json({ error: "Invalid token" });
  }
};

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
      req.user = decoded;
      next(); // Allow access
    } else {
      res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = { adminAuth, userAdminAuth, authenticate };
