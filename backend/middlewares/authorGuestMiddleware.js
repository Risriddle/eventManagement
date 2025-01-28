


const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const authenticateGuestOrUser = (req, res, next) => {
    
    const token = req.headers.authorization?.split(" ")[1];
    

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
        
        decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        decoded.role = "user"; 
        console.log("Authenticated as USER");
    } catch (error1) {
        try {
            
            decoded = jwt.verify(token, process.env.GUEST_JWT_SECRET);
            decoded.role = "guest"; 
            console.log("Authenticated as GUEST");
        } catch (error2) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    }

    req.user = decoded; 
    next();
};

module.exports = authenticateGuestOrUser;
