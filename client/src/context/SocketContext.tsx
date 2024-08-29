import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

declare global {
  interface Window {
    socket: any;
  }
}


export const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://express-project-1b7b8f3ee21b.herokuapp.com/'  // Production URL
    : 'http://localhost:3000'               // Development URL
);

export const SocketContext = createContext({
  socket,
  rooms: [] as string[],
  setRooms: (rooms: string[]) => {}
});

window.socket = socket;


function SocketsProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    socket.on("rooms", (updatedRooms: string[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off("rooms");
    };
  }, []);

  const value = {
    socket,
    rooms,
    setRooms,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}


export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
