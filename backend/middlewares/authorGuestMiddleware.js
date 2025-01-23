// const authenticateGuestOrUser = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     console.log(token,"in middlewarerrrrrrrrrrrrrrrrrr")
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, "your_secret_key");

//         if (decoded.role === "guest" || decoded.role === "user") {
//             req.user = decoded;
//             return next();
//         }

//         return res.status(403).json({ message: "Access denied: Invalid role" });
//     } catch (error) {
//         return res.status(403).json({ message: "Invalid or expired token" });
//     }
// };

// module.exports=authenticateGuestOrUser



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
        // Try verifying with User Secret Key
        decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        decoded.role = "user"; // Ensure role is correctly set
        console.log("Authenticated as USER");
    } catch (error1) {
        try {
            // If user verification fails, try with Guest Secret Key
            decoded = jwt.verify(token, process.env.GUEST_JWT_SECRET);
            decoded.role = "guest"; // Ensure role is correctly set
            console.log("Authenticated as GUEST");
        } catch (error2) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    }

    req.user = decoded; // Attach the decoded token to req.user
    next();
};

module.exports = authenticateGuestOrUser;
