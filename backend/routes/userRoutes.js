const express=require('express')
const authController=require('../controllers/authController')
const Router=express.Router()

Router.post('/signUp',authController.signUp)
Router.post('/signIn',authController.signIn)
Router.post('/sendMail',authController.sendMail)
Router.post('/verifyMail',authController.verifyMail)
Router.post('/verifyToken',authController.verifyToken)
// Router.get('/getNewAccessToken',authController.getNewAccessToken)
Router.get("/guestLogin",authController.guestLogin)
Router.post("/logout",authController.logout)

module.exports=Router;