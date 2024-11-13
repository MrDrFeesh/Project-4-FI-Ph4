import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function EventList() {
  const [events, setEvents] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch("/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  const handleEventClick = (id) => {
    history.push(`/events/${id}`);
  };

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id} onClick={() => handleEventClick(event.id)}>
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;