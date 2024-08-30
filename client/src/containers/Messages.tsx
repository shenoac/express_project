import { useEffect, useState, useRef } from 'react';
import { useSockets } from '../context/SocketContext';
import ButtonUsage from '../components/ButtonUsage';
import InputField from '../components/InputField';
import Typography from '@mui/material/Typography'; // Import Typography from Material-UI
import Box from '@mui/material/Box'; // Import Box for layout

interface Message {
  username: string;
  content: string;
  timestamp: string;
}

function MessagesContainer() {
  const { socket, currentRoom, username } = useSockets();
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);

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
      <div className="messages-list" style={{ marginBottom: '25px' }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.username === username ? 'flex-start' : 'flex-end',
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                maxWidth: '60%',
                bgcolor: msg.username === username ? '#e0f7fa' : '#90caf9',
                color: msg.username === username ? '#000' : '#fff',
                padding: '8px 12px',
                borderRadius: '16px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <strong>{msg.username}</strong>: {msg.content}
              <em style={{ fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </em>
            </Typography>
          </Box>
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
