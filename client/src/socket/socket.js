import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const connect = (username) => {
    socket.connect();
    if (username) socket.emit('user_join', username);
  };

  const disconnect = () => socket.disconnect();
  const sendMessage = (message) => socket.emit('send_message', { message });
  const sendPrivateMessage = (to, message) => socket.emit('private_message', { to, message });
  const setTyping = (isTyping) => socket.emit('typing', isTyping);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('receive_message', (msg) => {
      setLastMessage(msg);
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('private_message', (msg) => {
      setLastMessage(msg);
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('user_list', setUsers);
    socket.on('user_joined', (user) => {
      setMessages((prev) => [...prev, { id: Date.now(), system: true, message: `${user.username} joined the chat`, timestamp: new Date().toISOString() }]);
    });
    socket.on('user_left', (user) => {
      setMessages((prev) => [...prev, { id: Date.now(), system: true, message: `${user.username} left the chat`, timestamp: new Date().toISOString() }]);
    });
    socket.on('typing_users', setTypingUsers);

    return () => {
      socket.off('connect'); socket.off('disconnect');
      socket.off('receive_message'); socket.off('private_message');
      socket.off('user_list'); socket.off('user_joined'); socket.off('user_left');
      socket.off('typing_users');
    };
  }, []);

  return { socket, isConnected, lastMessage, messages, users, typingUsers, connect, disconnect, sendMessage, sendPrivateMessage, setTyping };
};

export default socket;
