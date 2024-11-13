import React, { useEffect, useState } from "react";

function UserProfile({ user }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/users/${user.id}/events`)
        .then((response) => response.json())
        .then((data) => setEvents(data));
    }
  }, [user]);

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <h3>Events</h3>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;