import React, { useEffect } from 'react';
import  io  from 'socket.io-client';




const socket = io('http://localhost:3000');

const App = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message', (message: any) => {
      console.log('Received message:', message);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  return (
    <div className="App">
      <h1>Chat App</h1>
    </div>
  );
};

export default App;
