const express=require('express')
const tokenController=require('../controllers/tokenController')


const Router=express.Router()


Router.get('/getNewAccessToken',tokenController.getNewAccessToken)


module.exports=Router