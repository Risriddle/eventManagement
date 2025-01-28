import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { getEvents, deleteEvent, updateEvent } from '../services/api';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react'; 
import '../css/Dashboard.css';
 

const Dashboard = () => {
    const { isAuthenticated, loading } = useAuth();
    const [events, setEvents] = useState([]);
    const [eventToUpdate, setEventToUpdate] = useState(null);
    const token=sessionStorage.getItem("accessToken")
    const [updatedEventData, setUpdatedEventData] = useState({
        eventName: '',
        eventDate: '',
        eventDescription: '',
        eventTime: '',
        eventOrganizer: '',
        eventImage: null
    });
    const [isEventOpen, setIsEventOpen] = useState(null);
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/signIn');
        }
    }, [isAuthenticated, loading, navigate]);

    useEffect(() => {
     
        const socket = io('http://localhost:5001', {
            auth: {
                token: token
            },
            withCredentials:true,
            transports: ["websocket", "polling"],
           extraHeaders: { "Access-Control-Allow-Credentials": "true" } 
        });
       
        socket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });
        
        socket.on("updateAttendees", (updatedEvent) => {
            console.log("Received real-time event update:", updatedEvent);
            setEvents((prevEvents) =>
                prevEvents.map(event =>
                    event._id === updatedEvent._id ? updatedEvent : event
                )
            );
        });
    
        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
        });
    
        return () => socket.disconnect();
    }, []);
    

    useEffect(() => {
        const fetchEvents = async () => {
            const res = await getEvents();
            setEvents(res);
        };
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (eventId) => {
        const res = await deleteEvent({ eventId });
        console.log(res,"handle delete in dashboarddddddddddddddddddddd")
        setEvents(events.filter(event => event._id !== eventId));
    };

    const handleUpdateEvent = async () => {
        const formData = new FormData();
        Object.keys(updatedEventData).forEach((key) => {
            formData.append(key, updatedEventData[key]);
        });

        const res = await updateEvent(eventToUpdate._id, formData);
        setEventToUpdate(null);
        setEvents(events.map(event => (event._id === res._id ? res : event)));
        setIsUpdateFormVisible(false); 
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setUpdatedEventData(prevData => ({ ...prevData, eventImage: files[0] }));
        } else {
            setUpdatedEventData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const toggleUpdateForm = (event) => {
        setEventToUpdate(event);
        setUpdatedEventData({
            eventName: event.eventName,
            eventDate: event.eventDate,
            eventDescription: event.eventDescription,
            eventTime: event.eventTime,
            eventOrganizer: event.eventOrganizer
        });
        setIsUpdateFormVisible(!isUpdateFormVisible); 
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome to Your Event Dashboard</h1>
            <div className="dashboard-buttons">
                <button onClick={() => navigate('/createEvent')} className="btn btn-primary">
                    Create Event
                </button>
                <button onClick={() => navigate('/joinEvent')} className="btn btn-secondary">
                    Browse Events
                </button>
            </div>
            <h3>Events Created by You</h3>
            <div className="events-list">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div className="event-card" key={event._id}>
                            <div className="event-header">
                                <h3>{event.eventName}</h3>
                                <div className="event-status">
    {new Date(`${event.eventDate}T${event.eventTime}`) == new Date() ? (
        <span className="status-live">Live</span>
    ) : (
        <span className="status-offline">Offline</span>
    )}
</div>

                            </div>
                            <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {event.eventTime}</p>
                            <p><strong>Organizer:</strong> {event.eventOrganizer}</p>
                            {event.attendees.length > 0 ? (
                                <div><strong>Attendees:</strong>
                                    <ul>
                                        {event.attendees.map((attendee, index) => (
                                            <li key={index}>{attendee}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>No attendees</p>
                            )}
                            {event.eventImage && <img src={event.eventImage} alt={event.eventName} className='event-image'/>}
                            
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteEvent(event._id)}
                            >
                                <Trash2 /> DELETE
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => toggleUpdateForm(event)} // Toggle form visibility
                            >
                                <Edit /> UPDATE
                            </button>

                            <button
                                className="btn btn-info"
                                onClick={() => setIsEventOpen(event._id === isEventOpen ? null : event._id)}
                            >
                                {isEventOpen === event._id ? <EyeOff /> : <Eye />} 
                                {isEventOpen === event._id ? 'Hide Details' : 'View Details'}
                            </button>
                            
                            {isEventOpen === event._id && (
                                <div className="event-details">
                                    <p><strong>Description:</strong> {event.eventDescription}</p>
                                    <p><strong>Attendees Count:</strong> {event.eventAttendeesCount}</p>
                                </div>
                            )}

                          
                            {isUpdateFormVisible && eventToUpdate && eventToUpdate._id === event._id && (
                                <div className="update-event-form">
                                    <input
                                        type="text"
                                        name="eventName"
                                        value={updatedEventData.eventName}
                                        onChange={handleInputChange}
                                        placeholder="Event Name"
                                    />
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={updatedEventData.eventDate}
                                        onChange={handleInputChange}
                                    />
                                    <textarea
                                        name="eventDescription"
                                        value={updatedEventData.eventDescription}
                                        onChange={handleInputChange}
                                        placeholder="Event Description"
                                    />
                                    <input
                                        type="time"
                                        name="eventTime"
                                        value={updatedEventData.eventTime}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="eventOrganizer"
                                        value={updatedEventData.eventOrganizer}
                                        onChange={handleInputChange}
                                        placeholder="Event Organizer"
                                    />
                                    <input
                                        type="file"
                                        name="eventImage"
                                        onChange={handleInputChange}
                                        accept="image/*"
                                    />
                                    <button className="btn btn-success" onClick={handleUpdateEvent}>Save Changes</button>
                                    <button className="btn btn-secondary" onClick={() => setIsUpdateFormVisible(false)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No events available</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
