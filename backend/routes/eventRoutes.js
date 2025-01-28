const express=require('express')
const eventController=require('../controllers/eventController')
const authenticateUser=require('../middlewares/authMiddleware')
const authenticateGuestOrUser=require('../middlewares/authorGuestMiddleware')
const Router=express.Router()

Router.post("/createEvent",authenticateUser,eventController.createEvent)
Router.get("/getEvents",authenticateUser,eventController.getEvents)
Router.put("/updateEvent/:id",authenticateUser,eventController.updateEvent)
Router.post("/deleteEvent",authenticateUser,eventController.deleteEvent)
Router.get("/getAllEvents",authenticateGuestOrUser,eventController.getAllEvents)
Router.post("/getEventById",authenticateUser,eventController.getEventById)

module.exports=Router