import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/api';
import { io } from 'socket.io-client';
import '../css/EventDetail.css'; 

const EventDetail = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("accessToken");
    const userEmail = sessionStorage.getItem("userEmail");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            auth: { token: token },
            withCredentials: true,
            transports: ["websocket", "polling"],
            extraHeaders: { "Access-Control-Allow-Credentials": "true" } 
        });

        setSocket(newSocket);

        const fetchEventDetails = async () => {
            try {
                const res = await getEventById({ eventId });
                setEvent(res);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };
        fetchEventDetails();

        newSocket.on("eventUpdated", (updatedEvent) => {
            if (updatedEvent._id === eventId) {
                setEvent(updatedEvent);
            }
        });

        newSocket.on("userLeft", ({ eventId: leftEventId, userEmail }) => {
            if (leftEventId === eventId) {
                setEvent(prev => ({
                    ...prev,
                    attendees: prev.attendees.filter(email => email !== userEmail),
                    eventAttendeesCount: Math.max(0, prev.eventAttendeesCount - 1)
                }));
            }
        });

        return () => {
            newSocket.emit("leaveEvent", { eventId, userEmail });
            newSocket.disconnect();
        };
    }, [eventId, token, userEmail]);

    const handleLeaveEvent = () => {
        if (!userEmail || !socket) return;
        socket.emit("leaveEvent", { eventId, userEmail });
        navigate("/joinEvent");
    };

    if (!event) return <p>Loading event details...</p>;

    return (
        <div className="event-detail-container">
            <h2>{event.eventName}</h2>
            <p>{event.eventDescription}</p>
            <p><strong>Organizer:</strong> {event.eventOrganizer}</p>
            <p><strong>Time:</strong> {event.eventTime}</p>
            <p><strong>Attendees Count:</strong> {event.eventAttendeesCount}</p>
           
            <button onClick={handleLeaveEvent}>Leave Event</button>

            <h3>Attendees:</h3>
            <ul>
                {event.attendees.map((email, index) => (
                    <li key={index}>{email}</li>
                ))}
            </ul>
        </div>
    );
};

export default EventDetail;
