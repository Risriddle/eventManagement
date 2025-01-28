const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

console.log(token,"access token in middlewareeeeeeeeeeeee")
  if (!token) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  try {

    
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(403).json({ error: "Forbidden, invalid token" });
  }
};

module.exports = authenticateUser;
