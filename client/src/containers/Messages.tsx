import { useEffect, useState, useRef } from 'react';
import { useSockets } from '../context/SocketContext';

interface Message {
  username: string;
  content: string;
  timestamp: string;
}

function MessagesContainer() {
  const { socket } = useSockets();
  const [messages, setMessages] = useState<Message[]>([]); // Correct type for the messages state
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    socket.on("receiveMessage", (message: Message) => { // Expecting the full Message object
      console.log("Received message from server:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  const handleSendMessage = () => {
    const message = messageRef.current?.value;
    if (message) {
      console.log("Sending message:", message);
      socket.emit("sendMessage", message);
      messageRef.current.value = "";
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((msg, index) => {
          console.log("Message object:", msg); // Log the msg object to see its structure
          return (
            <p key={index}>
              <strong>{msg.username}</strong>: {msg.content} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
            </p>
          );
        })}
      </div>
      <div className="message-input">
        <textarea ref={messageRef} placeholder="Type your message"></textarea>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessagesContainer;
