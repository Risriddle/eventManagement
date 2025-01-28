
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config();

// Initialize S3 client (AWS SDK v3)
const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.createEvent = [
  upload.single('eventImage'),
  async (req, res) => {
    const { eventName, eventDate, eventDescription, eventTime, eventOrganizer } = req.body;

    try {
      
      const file = req.file;
      console.log(file,"00000000000000000000000000000000000")
      if (!file) {
        // return res.status(400).json({ error: 'No event image uploaded' });
        const newEvent = new Event({
          eventName,
          eventDate,
          eventDescription,
          eventImage: null ,
          eventTime,
          eventOrganizer,
          createdBy:req.user.userId,
        });
      
        await newEvent.save();
        res.status(200).json({ message: 'Event created successfully', event: newEvent });
  
      }
else{
      // Upload file to S3
      const fileName = `events/${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read'
      };

      await s3.send(new PutObjectCommand(uploadParams));

      // Construct the file URL
      const eventImageUrl  = `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileName}`;
      
      // Save event details to database
      const newEvent = new Event({
        eventName,
        eventDate,
        eventDescription,
        eventImage: eventImageUrl ,
        eventTime,
        eventOrganizer,
        createdBy:req.user.userId,
      });
    
      await newEvent.save();
      res.status(200).json({ message: 'Event created successfully', event: newEvent });
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }
];



exports.getEvents=async(req,res)=>{
    try {
      // console.log(req.user)
        const events = await Event.find({ createdBy: req.user.userId }); 
        // console.log(events,"backenddddddddddddddddddddddddddddddddddddd")
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
}



exports.getAllEvents=async(req,res)=>{
    try {
        const events = await Event.find(); 
        // console.log(events,"backenddddddddddddddddddddddddddddddddddddd")
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
}

exports.getEventById=async(req,res)=>{
    try {
        const {eventId}=req.body
        const event = await Event.findById(eventId)
        console.log(event,"backenddddddd get event by iddddd")
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
}





exports.deleteEvent=async(req,res)=>{
  try {
    const {eventId}=req.body
    console.log(eventId,"eventiddddddddddddddddddd")
      const event = await Event.findByIdAndDelete({_id:eventId}); 
      console.log(event,"backenddddddddddddddddddddddddddddddddddddd")
      res.status(200).json(event);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching events' });
  }
}


// Function to upload image to S3
const uploadToS3 =async (file) => {
    const fileName = `events/${Date.now()}_${file.originalname}`;
    
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
  
    };

    await s3.send(new PutObjectCommand(params));
    
    return `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileName}`;

};

// Function to delete old image from S3
const deleteFromS3 = async (imageUrl) => {
    if (!imageUrl) return;
    const imageKey = imageUrl.split('.amazonaws.com/')[1]; 
    console.log(imageKey,"imagekey in deletes3")
    // const imageKey = new URL(imageUrl).pathname.substring(1);; // Extract the file key from URL
    if (!imageKey) return;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageKey
    };

    await s3.send(new DeleteObjectCommand(params));
};

// Update Event Controller
exports.updateEvent =[ upload.single('eventImage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { eventName, eventDate, eventDescription, eventTime, eventOrganizer } = req.body;
        //  console.log(id,eventName, eventDate, eventDescription, eventTime, eventOrganizer,"=======================================")
        let updateData = { eventName, eventDate, eventDescription, eventTime, eventOrganizer };

        const event = await Event.findById(id);
        // console.log(event,"event to be updated")
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
// console.log(req.file,"-----------------------------------------")
        if (req.file) {
            // Delete the old image if exists
            if (event.eventImage) {
              console.log(event.eventImage,"image to be deleteddddddddddddddddd")
               const res= await deleteFromS3(event.eventImage);
               console.log(res,"eresponse from s3 to delete image")
            }

            // Upload new image
            const imageUrl = await uploadToS3(req.file);
            event.eventImage= imageUrl;
            const updateImage=await Event.findByIdAndUpdate({_id:id},{$set:{eventImage:imageUrl}},{new:true})
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        res.json(updatedEvent);
    } catch (err) {
        console.error("Error updating event:", err);
        res.status(500).json({ message: 'Server error' });
    }
}
];

