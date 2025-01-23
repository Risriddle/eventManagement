const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware function to authenticate the user based on the token
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
// const token =req.cookies.accessToken;
console.log(token,"access token in middlewareeeeeeeeeeeee")
  if (!token) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  try {

    // Verify the token using a secret key
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    req.user = decoded; // Store decoded user info for use in the route handler
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: "Forbidden, invalid token" });
  }
};

module.exports = authenticateUser;
