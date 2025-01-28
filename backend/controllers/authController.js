
const bcrypt=require('bcrypt')
const User=require('../models/User')
const crypto=require('crypto')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');



exports.signUp = async (req, res) => {
  const { email, pwd } = req.body;


  if (!email || !pwd) {
      return res.status(400).json({ message: "Email and password are required." });
  }

  try {
   
      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
          return res.status(400).json({ message: "User already registered!" });
      }
     else{

      const hashedPwd = await bcrypt.hash(pwd, 10);

      user = await User.create({
          email: email.toLowerCase(),
          pwd: hashedPwd,
      });

      res.status(201).json({ message: "User registered successfully!", user: { email: user.email } });
     }
  } catch (error) {
      console.error("Error during sign-up:", error);
    return  res.status(500).json({ message: "Internal error while signing up user", error: error.message });
  }
};



exports.sendMail=async(req,res)=>{
    const {email}=req.body
    const verificationToken=crypto.randomBytes(32).toString('hex')
    const tokenExpiration=Date.now()+3600000;
    console.log(email)
    try{
        await User.findOneAndUpdate({email:email},
            {$set:{
                verificationToken:verificationToken,
                tokenExpiration:tokenExpiration,
            }}
        )
        const verificationLink=`http://localhost:5173/verifyMail?token=${verificationToken}`
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
                      user: process.env.MAIL_USERNAME,
                      pass: process.env.MAIL_PASSWORD,
                      clientId: process.env.OAUTH_CLIENT_ID,
                      clientSecret: process.env.OAUTH_CLIENT_SECRET,
                      // accessToken: process.env.OAUTH_ACCESS_TOKEN,
                      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
           
          });
  
          let mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Email Verification',
            text: `Click this link to verify your email: ${verificationLink}`,
          };
      
          await transporter.sendMail(mailOptions);
          res.status(200).json({ message: 'Verification email sent successfully.' });
        } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Failed to send verification email.', error: error.message });
        }
}


exports.verifyMail=async(req,res)=>{
        const {token}=req.body
        console.log(token)
        try{
        const user = await User.findOne({ verificationToken: token });
        console.log(user,"----------------------------")
            if (!user) {
              return res.status(400).json({ message: 'Invalid or expired token.',verified:false });
            }
        
            if (user.tokenExpiration < Date.now()) {
              return res.status(400).json({ message: 'Token has expired.',verified:false });
            }
        
            user.isVerified = true;
            user.verificationToken = undefined;
            user.tokenExpiration = undefined;
        
            await user.save();
            res.status(200).json({ verified: true });
          } catch (error) {
            res.status(500).json({ message: 'Failed to verify email', error: error.message,verified:false });
          }
}



exports.signIn = async (req,res) => {
    const { email, pwd } = req.body;
    console.log(email,pwd,"-------------------------------")
    try{
      const user = await User.findOne({ email });
    if (!user ) {
        
        return res.status(400).json({message:"User not Signed Up"})
    }
if(!user.isVerified){
  return res.status(400).json({message:"User email not verified"})
    
}
    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      
        return res.status(400).json({message:"Invalid Password"})
    }

    const accessToken = jwt.sign({ userId: user._id, email: user.email ,role: "user" }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: '1h' 
    });

    const refreshToken = jwt.sign({ userId: user._id, email: user.email,role: "user" }, process.env.REFRESH_JWT_SECRET, {
      expiresIn: '7d' 
  });
 
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,  
    sameSite:'None',
    secure:true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path:"/",
    
});
console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
  
    res.status(200).json({
      accessToken:accessToken,
      success:true,
      message:"User logged in successfully",
      user,
    })
    }
    catch(error)
    {
      console.error("Error signing in user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};



exports.verifyToken = (req, res) => {
 

  const {token} = req.body;
  // console.log(token,"inverify tokennnnnnnnnnnbackend")
  if (!token) {
      return res.status(401).json({ message: "Token is missing" });
  }
  try {
      const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
      console.log("in verify token",decoded)
      res.json({ valid: true, decoded });
  } catch (err) {
      res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
};




exports.guestLogin=async(req, res)=>{
  const guestId = `guest_${Date.now()}`; 
    const guestToken = jwt.sign({ guestId, role: "guest" }, process.env.GUEST_JWT_SECRET, { expiresIn: "1d" });
     return res.json({ message: "Guest session created", guestToken });
}


exports.logout=async(req,res)=>{
  const refreshToken = req.cookies.refreshToken; 
  console.log(refreshToken,"refreshToken cookie------------")
    if (!refreshToken) return res.sendStatus(403);
  
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });

    res.json({ message: "Logged out successfully" });

    })

}