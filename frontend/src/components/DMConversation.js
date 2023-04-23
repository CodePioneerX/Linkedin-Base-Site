import { useEffect, useState } from 'react';
import axios from 'axios';
import { w3cwebsocket as WebSocket } from 'websocket';

const DMConversation = ({ senderId, recipientId, conversationId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Create WebSocket connection to server
    const newWs = new WebSocket(`ws://localhost:8000/ws/dm_conversation/${conversationId}/`);
    // Set WebSocket connection to state
    setWs(newWs);
    // Clean up function to close WebSocket connection when component unmounts
    return () => {
      newWs.close();
    };
  }, [conversationId]);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    // Send message to server using WebSocket
    ws.send(JSON.stringify({
      senderId,
      recipientId,
      message: messageInput,
    }));
    // Clear input field
    setMessageInput('');
  };

  return (
    <div>
      <h2>DM Conversation</h2>
      <p>Sender: {senderId}</p>
      <p>Recipient: {recipientId}</p>
      <ul>
        {/* Render list of messages */}
      </ul>
      <form onSubmit={handleMessageSubmit}>
        <input type="text" value={messageInput} onChange={(event) => setMessageInput(event.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
export default DMConversation;