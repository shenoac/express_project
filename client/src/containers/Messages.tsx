import { useEffect, useState, useRef } from 'react';
import { useSockets } from '../context/SocketContext';

function MessagesContainer() {
  const { socket } = useSockets();
  const [messages, setMessages] = useState<string[]>([]);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    socket.on("receiveMessage", (message: string) => {
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
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
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
