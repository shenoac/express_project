import express from 'express';
import { createServer } from 'http';  // For creating the HTTP server
import { Server as SocketIOServer } from 'socket.io';  // Import Socket.IO
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('../client/public'));

app.get('/', (req, res) => {
  res.send('Welcome to the Express App!');
});

// Create an HTTP server and attach Socket.IO to it
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",  // Enable CORS if needed
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
