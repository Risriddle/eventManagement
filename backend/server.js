


const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const http = require('http');
const socketIo = require('socket.io');
const Event=require('./models/Event')
const User=require('./models/User')
const jwt = require('jsonwebtoken');




// const eventController = require('./controllers/eventController'); // Import your controller

// app.use(cookieParser()); 
require('dotenv').config();

const server = http.createServer(app);
// const io = socketIo(server);
const io = socketIo(server,{  cookie: true}, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
      credentials: true, // Allow cookies and credentials
    }
})
const port = process.env.PORT;
const DB = process.env.MONGODB_URI;

mongoose.connect(DB, {})
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ['GET', 'POST','PUT','DELETE'],
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api', tokenRouter);




io.on('connection', (socket) => {
  console.log('A user connected');

  const token = socket.handshake.auth?.token;
   console.log(token, "token in socket-------------");

  if (token) {
      jwt.verify(token, process.env.ACCESS_JWT_SECRET, async (err, decoded) => {
          if (err) {
              console.log('Token verification failed:', err);
              socket.disconnect();
              return;
          }
          console.log(decoded.userId,"------------------------")
          const user = await User.findById(decoded.userId);
          if (!user) {
              console.log('User not found');
              socket.disconnect();
              return;
          }

          console.log('Authenticated user:', user);

          // Listen for event join request
          socket.on('joinEvent', async ({ eventId }) => {
              try {
                  const event = await Event.findById(eventId);
                  if (!event) {
                      console.log('Event not found');
                      return;
                  }

                  // Check if user is already in the attendees list
                  if (!event.attendees.includes(user.email)) {
                      event.attendees.push(user.email);
                      event.eventAttendeesCount += 1;
                      await event.save();
                      console.log(event.attendees,"-----------------------------")
                      // Emit an update for attendee count
                      io.emit('eventUpdated', event);

                      // Emit a "userJoined" event with user info
                      io.emit('userJoined', { eventId, userEmail: user.email });
                      io.emit("updateAttendees", event); 


                        
                  }
              } catch (error) {
                  console.error('Error joining event:', error);
              }
          });
      });
      socket.on('leaveEvent', async ({ eventId, userEmail }) => {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                console.log('Event not found');
                return;
            }
    
            // Remove user from attendees
            event.attendees = event.attendees.filter(email => email !== userEmail);
            event.eventAttendeesCount = Math.max(0, event.attendees.length);

            await event.save();
    
            // Notify all clients
            io.emit('userLeft', { eventId, userEmail });
            io.emit("updateAttendees", event); 
        } catch (error) {
            console.error('Error leaving event:', error);
        }
    });
    
  } else {
      console.log('No token provided');
      socket.disconnect();
  }

  socket.on('disconnect', () => {

      console.log('A user disconnected');
    


  });
});


// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});







