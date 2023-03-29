import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

function UserList(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL + 'users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleUserClick(user) {
    props.onUserSelected(user);
  }

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;