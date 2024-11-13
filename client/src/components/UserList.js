import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function UserList({ onSignIn }) {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch("/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleUserClick = (user) => {
    onSignIn(user);
    history.push("/profile");
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            ID: {user.id} - Username: {user.username} - Email: {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;