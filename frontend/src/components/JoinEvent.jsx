import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../services/api';
import { io } from 'socket.io-client';
import { Calendar, Users, Play } from 'lucide-react'; 
import '../css/JoinEvent.css';

const JoinEvent = () => {
    const [events, setEvents] = useState([]);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("accessToken");
    const userEmail = sessionStorage.getItem("userEmail");

    useEffect(() => {
       
        const newSocket = io('http://localhost:5001', {
            auth: {
                                token: token
                            },
             withCredentials:true,
            transports: ["websocket", "polling"],
           extraHeaders: { "Access-Control-Allow-Credentials": "true" } 
        });

        setSocket(newSocket);

        // Fetch events initially
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                setEvents(response);
            } catch (error) {
                console.error('Failed to fetch events', error);
            }
        };
        fetchEvents();

        // Listen for real-time event updates
        newSocket.on("userJoined", ({ eventId, userEmail }) => {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId
                        ? { ...event, eventAttendeesCount: event.eventAttendeesCount + 1 }
                        : event
                )
            );
        });

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    const handleJoinEvent = (eventId) => {
        if (!socket || !userEmail) return;
           console.log("---------------------------------------")
        // Emit join event
        socket.emit("joinEvent", { eventId, userEmail });

        // Navigate to event details page
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="join-event-container">
            <h2>Join an Event</h2>
            <div className="event-cards">
                {events.map((event) => (
                    <div key={event._id} className="event-card">
                        <div className="event-card-header">
                            <h3>{event.eventName}</h3>
                            <p className="event-description">
                                {event.eventDescription}
                            </p>
                        </div>
                        <div className="event-info">
                            <div className="info-item">
                                <Calendar />
                                <span>{event.eventDate}</span>
                            </div>
                            <div className="info-item">
                                <Users />
                                <span>Attendees: {event.eventAttendeesCount}</span>
                            </div>
                        </div>
                        <div className="event-actions">
                            <button className="join-button" onClick={() => handleJoinEvent(event._id)}>
                                <Play /> Join Event
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JoinEvent;
