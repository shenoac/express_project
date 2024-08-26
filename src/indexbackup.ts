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

  // Broadcast to all other clients that a new user has joined
  broadcast('A new user has joined the chat', ws);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Broadcast the received message to all other clients
    broadcast(message.toString(), ws);
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket connection closed');
    // Notify other clients that a user has left
    broadcast('A user has left the chat', ws);
  });
});

// Function to broadcast messages to all clients except the sender
function broadcast(message: string, sender: WebSocket) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export default app;
