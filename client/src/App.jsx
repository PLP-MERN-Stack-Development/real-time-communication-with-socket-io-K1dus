import React, { useState } from 'react';
import { useSocket } from './socket/socket';
import Chat from './components/Chat';

function App() {
  const { isConnected, connect, disconnect, users } = useSocket();
  const [username, setUsername] = useState('');

  const handleJoin = () => {
    if (username.trim()) connect(username.trim());
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {!isConnected ? (
        <div>
          <h2>Join the Chat</h2>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Chat App</h2>
          <button onClick={disconnect}>Leave Chat</button>
          <p>Online Users: {users.map(u => u.username).join(', ')}</p>
          <Chat />
        </div>
      )}
    </div>
  );
}

export default App;
