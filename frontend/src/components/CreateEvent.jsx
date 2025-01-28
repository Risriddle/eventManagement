
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/api';
import { Edit, Calendar, Clock, FileText, User } from 'lucide-react';
import '../css/CreateEvent.css';

const CreateEvent = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventImage, setEventImage] = useState('');
    const [eventOrganizer, setEventOrganizer] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [isImageOptional, setIsImageOptional] = useState(false); 
    const [timePeriod, setTimePeriod] = useState('AM');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedTime = eventTime + ' ' + timePeriod;
        try {
            const response = await createEvent({
                eventName,
                eventDate,
                eventDescription,
                eventImage: isImageOptional ? null : eventImage,
                eventTime: formattedTime,
                eventOrganizer
            });
            console.log(response, 'Event created successfully');
            if (response) {
                navigate('/dashboard');
            } else {
                alert('Failed to create event');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating event');
        }
    };

    return (
        <div className="create-event-container">
            <h2>Create an Event</h2>
            <form onSubmit={handleSubmit} className="create-event-form">
                <div className="input-group">
                    <Edit />
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Event Name"
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <User />
                    <input
                        type="text"
                        value={eventOrganizer}
                        onChange={(e) => setEventOrganizer(e.target.value)}
                        placeholder="Event Organizer Name"
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <Calendar />
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="input-group time-group">
                    <Clock />
                    <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="input-field"
                    />
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="time-period"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
               
<div className="input-group">
                    <FileText />
                    <label>
                        <input
                            type="checkbox"
                            checked={isImageOptional}
                            onChange={(e) => setIsImageOptional(e.target.checked)}
                        />
                        Don't Upload Image
                    </label>
                    {!isImageOptional && (
                        <input
                            type="file"
                            onChange={(e) => setEventImage(e.target.files[0])}
                            className="input-field"
                        />
                    )}
                </div>
                <div className="input-group">
                    <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Event Description"
                        className="input-field textarea"
                    />
                </div>
                <button type="submit" className="submit-btn">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
