import { useEffect, useState, useRef } from 'react';
import { useSockets } from '../context/SocketContext';
import ButtonUsage from '../components/ButtonUsage';
import InputField from '../components/InputField';
import Typography from '@mui/material/Typography'; // Import Typography from Material-UI

interface Message {
  username: string;
  content: string;
  timestamp: string;
}

function MessagesContainer() {
  const { socket, currentRoom, username } = useSockets();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLInputElement>(null); // Updated to match InputField's inputRef type

  useEffect(() => {
    if (!currentRoom) return;

    socket.on('receiveMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, currentRoom]);

  const handleSendMessage = () => {
    const messageContent = messageRef.current?.value;
    if (messageContent && username) {
      const message = {
        username,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', message);
      if (messageRef.current) {
        messageRef.current.value = ''; // Clear the input field after sending
      }
    }
  };

  return (
    <div className="messages-container">
      <div
        className="messages-list"
        style={{ marginBottom: '25px' }} // Add marginBottom to create space
      >
        {messages.map((msg, index) => (
          <Typography variant="body1" key={index}>
            <strong>{msg.username}</strong>: {msg.content} 
            <em>({new Date(msg.timestamp).toLocaleTimeString()})</em>
          </Typography>
        ))}
      </div>
      <div className="message-input">
        <InputField
          label="Message"
          placeholder="Type your message..."
          ref={messageRef} // Attach ref to the InputField
        />
        <ButtonUsage onClick={handleSendMessage} label="Send" />
      </div>
    </div>
  );
}

export default MessagesContainer;
