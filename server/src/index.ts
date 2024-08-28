import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Set CORS options based on environment
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: 'https://your-production-domain.com', methods: ['GET', 'POST'], credentials: true }
  : { origin: ['http://localhost:3000', 'http://localhost:3001'], methods: ['GET', 'POST'], credentials: true };

// Add CORS middleware to allow requests from your frontend
app.use(cors(corsOptions));

// Configure Socket.IO to handle WebSocket connections and handle CORS
const io = new SocketIOServer(server, {
  cors: corsOptions,
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../client/build')));

// Serve frontend app for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Handle WebSocket connections
io.on('connection', (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle message sending
  socket.on('sendMessage', (message: string) => {
    console.log(`Message received: ${message}`);
    // Broadcast the message to all clients
    io.emit('receiveMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
