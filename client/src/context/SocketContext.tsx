// Import necessary modules from React and Socket.IO client
import { createContext, useContext } from 'react';
import io from 'socket.io-client';

declare global {
  interface Window {
    socket: any; // You can use a more specific type if you know it (e.g., SocketIOClient.Socket)
  }
}

// Initialize a Socket.IO connection using the correct environment
export const socket = io ('http://localhost:3000')  // Use localhost for development

// Create a context to store the socket instance, which can be accessed by any component in the app
export const SocketContext = createContext(socket);
window.socket = socket;

// Define a provider component to wrap around the app and provide the socket instance to all child components
function SocketsProvider({ children }: { children: React.ReactNode }) {
  return (
    // Use the context provider to pass the socket instance to any component that needs it
    <SocketContext.Provider value={socket}>
      {children} {/* Render any child components passed to the provider */}
    </SocketContext.Provider>
  );
}

// Custom hook to allow easy access to the socket context in any component
export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
