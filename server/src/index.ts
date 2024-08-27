import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Add CORS middleware to allow requests from your frontend
app.use(cors({ origin: 'http://localhost:3001' })); // This is where your React app runs

// Configure Socket.IO to also handle CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3001', // Allow connections from the React app
    methods: ['GET', 'POST'],
  },
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../client/build')));

// Serve frontend app for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.broadcast.emit('message', message); // Broadcast to other clients
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
