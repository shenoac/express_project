import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';  // Correctly importing the Socket type

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Set up the socket connection based on the environment
    const socketConnection: Socket = io(process.env.NODE_ENV === 'production'
      ? 'https://express-project-1b7b8f3ee21b.herokuapp.com'
      : 'http://localhost:3000');
    
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to server');
    });

    socketConnection.on('message', (message) => {
      console.log('Received message:', message);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
