import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://express-project-1b7b8f3ee21b.herokuapp.com/'
    : 'http://localhost:3000'
);

interface Room {
  roomId: string;
  name: string;
}

export const SocketContext = createContext({
  socket,
  currentRoom: '',
  setCurrentRoom: (room: string) => {},
  rooms: [] as Room[],
  setRooms: (rooms: Room[]) => {},
  username: '',
  setUsername: (username: string) => {}
});

function SocketsProvider({ children }: { children: React.ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<string>(''); 
  const [rooms, setRooms] = useState<Room[]>([]);
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');

  useEffect(() => {
    socket.on('rooms', (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off('rooms');
    };
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  const value = {
    socket,
    currentRoom,
    setCurrentRoom,
    rooms,
    setRooms,
    username,
    setUsername,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
