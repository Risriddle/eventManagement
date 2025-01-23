
const jwt = require('jsonwebtoken');



exports.getNewAccessToken=(req, res) => {
 
    const refreshToken = req.cookies.refreshToken; 
  console.log(refreshToken,"refreshToken cookie------------")
    if (!refreshToken) return res.sendStatus(403);
  
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
  
    
      const newAccessToken = jwt.sign({ 
        userId: user.userId,
        email: user.email,
        role: user.role 
      }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: '1h'
      });
  console.log(newAccessToken,"[[[[[[[[[newww[[[[[[[[[[[[[[[[[[")
      
  return res.status(200).json({ 
    accessToken: newAccessToken,
    email: user.email,
    message: "Access token refreshed successfully"
  });
    });
  }
  