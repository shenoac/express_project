import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/students';
import logRequest from './middleware/logRequest';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logRequest);
app.use(express.static('public'));

app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express App!');
});

// Create HTTP server instead of HTTPS
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New WebSocket connection established');

  let username: string;

  ws.on('message', (message) => {
    try {
      const msgData = JSON.parse(message.toString());
      console.log('Received message:', msgData);

      // Handle incoming username
      if (msgData.type === 'username') {
        username = msgData.data;
        broadcast({ type: 'notification', data: `${username} has joined the chat` }, ws);
      } else if (msgData.type === 'message') {
        // Broadcast user messages
        broadcast({ type: 'message', username, data: msgData.data, timestamp: msgData.timestamp }, ws);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ type: 'error', data: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket connection closed');
    if (username) {
      broadcast({ type: 'notification', data: `${username} has left the chat` }, ws);
    }
  });
});

// Function to broadcast messages to all clients except the sender
function broadcast(message: any, sender: WebSocket) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  });
}

export default app;

