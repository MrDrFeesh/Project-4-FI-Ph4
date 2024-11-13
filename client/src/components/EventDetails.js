import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

function EventDetails({ signedInUser }) {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`/events/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setTasks(data.tasks || []);
      });
  }, [id]);

  const handleDelete = () => {
    fetch(`/events/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        history.push("/events");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const isOrganizer = signedInUser && signedInUser.id === event.organizer_id;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      {event.organizer && (
        <p>Organizer: {event.organizer.username} (ID: {event.organizer_id})</p>
      )}
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name} - {task.description}</li>
        ))}
      </ul>
      {isOrganizer && (
        <div>
          <button onClick={handleDelete}>Delete Event</button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;