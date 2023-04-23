import React, { useState } from 'react';
import UserList from './UserList';
import DMConversation from './DMConversation';

function DMFeature() {
  const [selectedUser, setSelectedUser] = useState(null);

  function handleUserSelected(user) {
    setSelectedUser(user);
  }

  return (
    <div>
      {selectedUser ? (
        <DMConversation currentUser={currentUser} selectedUser={selectedUser} />
      ) : (
        <UserList onUserSelected={handleUserSelected} />
      )}
    </div>
  );
}

export default DMFeature;