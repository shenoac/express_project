import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

declare global {
  interface Window {
    socket: any;
  }
}

export const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://express-project-1b7b8f3ee21b.herokuapp.com/'
    : 'http://localhost:3000'
);

export const SocketContext = createContext({
  socket,
  currentRoom: '',
  setCurrentRoom: (room: string) => {},
  rooms: [] as string[],
  setRooms: (rooms: string[]) => {},
  username: '',
  setUsername: (username: string) => {}
});

window.socket = socket;

function SocketsProvider({ children }: { children: React.ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<string>('');  // Added currentRoom state
  const [rooms, setRooms] = useState<string[]>([]);
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');

  useEffect(() => {
    socket.on("rooms", (updatedRooms: string[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off("rooms");
    };
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  const value = {
    socket,
    currentRoom,  // Include currentRoom in the context value
    setCurrentRoom,  // Include setCurrentRoom in the context value
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
