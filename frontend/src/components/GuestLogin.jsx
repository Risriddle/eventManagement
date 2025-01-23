



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuestId, getAllEvents } from '../services/api';
import { Users, Eye, FileText } from 'lucide-react'; 
import '../css/GuestLogin.css';

const GuestLogin = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const guestLogin = async () => {
            const guestId = await getGuestId();
            if(guestId.guestToken){
                sessionStorage.setItem("guestToken", guestId.guestToken);
            sessionStorage.removeItem("accessToken")
            sessionStorage.removeItem("userEmail")
            console.log(guestId, "Guest login successful");
            }
            
        };
        guestLogin();
    }, []);

    const viewEvent = async () => {
        const events = await getAllEvents();
        console.log(events, "Events fetched for guest");
        setEvents(events);
    };

    return (
        <div className="guest-login-container">
            <h2>Logging in as Guest...</h2>
            <button className="view-events-btn" onClick={viewEvent}>
                <Eye /> View Events
            </button>

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
                                <Users />
                                <span>Attendees: {event.eventAttendeesCount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestLogin;
