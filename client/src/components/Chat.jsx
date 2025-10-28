import React, { useState } from 'react';
import { useSocket } from '../socket/socket';

const Chat = () => {
  const { messages, sendMessage, typingUsers, setTyping } = useSocket();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      setTyping(false);
    }
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ color: msg.system ? 'gray' : 'black' }}>
            {msg.system ? msg.message : <strong>{msg.sender}:</strong> + ` ${msg.message}`}
          </div>
        ))}
      </div>
      <div>
        <input
          value={message}
          onChange={(e) => { setMessage(e.target.value); setTyping(true); }}
          onBlur={() => setTyping(false)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {typingUsers.length > 0 && <p>{typingUsers.join(', ')} is typing...</p>}
    </div>
  );
};

export default Chat;
