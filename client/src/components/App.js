import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import UserForm from "./UserForm";
import EventForm from "./EventForm";
import TaskForm from "./TaskForm";
import AttendeeForm from "./AttendeeForm";
import UserList from "./UserList";
import EventList from "./EventList";
import EventDetails from "./EventDetails";
import UserProfile from "./UserProfile";
import UpdateEventForm from "./UpdateEventForm";

function App() {
  const [signedInUser, setSignedInUser] = useState(null);
  const [showUserButtons, setShowUserButtons] = useState(false);
  const [showEventButtons, setShowEventButtons] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleSignIn = (user) => {
    setSignedInUser(user);
  };

  const toggleUserButtons = () => {
    setShowUserButtons(!showUserButtons);
    setShowEventButtons(false);
    setShowUpdateForm(false);
  };

  const toggleEventButtons = () => {
    setShowEventButtons(!showEventButtons);
    setShowUserButtons(false);
    setShowUpdateForm(false);
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
    setShowUserButtons(false);
    setShowEventButtons(false);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <button onClick={() => setSignedInUser(null)}>Sign Out</button>
            </li>
            <li>
              <button onClick={toggleUserButtons}>Users</button>
              {showUserButtons && (
                <ul>
                  <li>
                    <Link to="/users/new">Create User</Link>
                  </li>
                  <li>
                    <Link to="/users">List Users</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={toggleEventButtons}>Events</button>
              {showEventButtons && (
                <ul>
                  <li>
                    <Link to="/events/new">Create Event</Link>
                  </li>
                  <li>
                    <Link to="/tasks/new">Create Task</Link>
                  </li>
                  <li>
                    <Link to="/attendees/new">Create Attendee</Link>
                  </li>
                  <li>
                    <Link to="/events">List Events</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={toggleUpdateForm}>Update</button>
              {showUpdateForm && (
                <ul>
                  <li>
                    <Link to="/update">Update Event</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/users/new" component={UserForm} />
          <Route path="/events/new">
            <EventForm signedInUser={signedInUser} />
          </Route>
          <Route path="/tasks/new" component={TaskForm} />
          <Route path="/attendees/new" component={AttendeeForm} />
          <Route path="/users">
            <UserList onSignIn={handleSignIn} />
          </Route>
          <Route path="/events/:id" component={EventDetails} />
          <Route path="/events" component={EventList} />
          <Route path="/profile">
            <UserProfile user={signedInUser} />
          </Route>
          <Route path="/update">
            <UpdateEventForm signedInUser={signedInUser} />
          </Route>
        </Switch>

        {signedInUser && (
          <div>
            <h3>Signed in as: {signedInUser.username}</h3>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;