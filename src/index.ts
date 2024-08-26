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
    const msgData = JSON.parse(message.toString());

    if (msgData.type === 'username') {
      username = msgData.data;
      // Notify all clients that a new user has joined
      broadcast({ type: 'notification', data: `${username} has joined the chat` }, ws);
    } else if (msgData.type === 'message') {
      // Broadcast the user's message to all clients
      broadcast({ type: 'message', username, data: msgData.data, timestamp: msgData.timestamp }, ws);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket connection closed');
    // Notify other clients that a user has left
    broadcast({ type: 'notification', data: `${username} has left the chat` }, ws);
  });
});

// Function to broadcast messages to all clients except the sender
function broadcast(message: any, sender: WebSocket) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

export default app;
