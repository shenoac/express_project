import { useEffect, useState } from 'react';
import { useSockets } from './context/SocketContext';

function App() {
  const socket = useSockets();
  const [socketId, setSocketId] = useState<string | undefined>("");
  const [message, setMessage] = useState("");

  // Handle setting the socket ID on connection
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, [socket]);

  // Handle receiving messages from the server
  useEffect(() => {
    socket.on("receiveMessage", (message: string) => {
      console.log("Received message from server:", message);  // Log the received message
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  // Handle sending a message
  const handleMessageSend = () => {
    if (message) {
      console.log("Sending message:", message);  // Log before emitting
      socket.emit("sendMessage", message); // Emit the message to the server
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <p>Socket ID: {socketId}</p>
      <div className="app-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleMessageSend}>Send Message</button>
      </div>
    </div>
  );
}

export default App;
