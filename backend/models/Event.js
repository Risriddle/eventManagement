const mongoose=require('mongoose')

const eventSchema=new mongoose.Schema(
{
    eventName: {
        type: String,
        required: true,
      },
      eventDate: {
        type: Date,
        required: true,
      },
      eventDescription: {
        type: String,
       
      },
      eventImage: {
        type: String, 
      
      },
      eventTime: {
        type: String,
        required: true,
      },
      eventOrganizer: {
        type: String,
        required: true,
      },
      eventAttendeesCount: {
        type:Number,
        default:0,
      },
      attendees:[String],
      link:{type:String},
      createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    
}

)


const Event=mongoose.model('event',eventSchema)
module.exports=Event;