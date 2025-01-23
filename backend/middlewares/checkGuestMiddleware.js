const checkGuest = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        // Normal authenticated user (not a guest)
        return next();
    } 
    // If guest, attach role and proceed (for view-only access)
    
    req.isGuest = true;
    next();
};

module.exports = checkGuest;