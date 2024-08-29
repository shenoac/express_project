import { useEffect, useState, useRef } from 'react';
import { useSockets } from '../context/SocketContext';
import React from 'react';

interface Message {
  username: string;
  content: string;
  timestamp: string;
}

function MessagesContainer() {
  const { socket, username } = useSockets();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    socket.on("receiveMessage", (message: Message) => {
      console.log("Received message from server:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  const handleSendMessage = () => {
    const messageContent = messageRef.current?.value;
    if (messageContent && username) {
      const message = {
        username,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", message);
      messageRef.current.value = "";
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.username}</strong>: {msg.content} <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
          </p>
        ))}
      </div>
      <div className="message-input">
        <textarea ref={messageRef} placeholder="Type your message"></textarea>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessagesContainer;
