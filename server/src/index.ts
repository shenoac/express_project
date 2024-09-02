import dotenv from 'dotenv';

dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);

import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';



const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this environment variable is set
  ssl: {
    rejectUnauthorized: false,
  },
});

const rooms: { roomId: string; name: string }[] = [];
const socketToRoom: { [socketId: string]: string } = {};

const app = express();
const server = createServer(app);

const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: 'https://express-project-1b7b8f3ee21b.herokuapp.com/', methods: ['GET', 'POST'], credentials: true }
  : { origin: ['http://localhost:3000', 'http://localhost:3001'], methods: ['GET', 'POST'], credentials: true };

app.use(cors(corsOptions));

const io = new SocketIOServer(server, {
  cors: corsOptions,
});

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

io.on('connection', (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('setUsername', (username: string) => {
    socket.data.username = username;
    console.log(`Username set for socket ${socket.id}: ${username}`);
  });

  socket.on('createRoom', (roomName: string) => {
    const roomId = uuidv4();
    const newRoom = { roomId, name: roomName };
    rooms.push(newRoom);
    socket.join(roomId);
    socketToRoom[socket.id] = roomId;
    io.emit('rooms', rooms);  // Broadcast updated room list
  });

  socket.on('joinRoom', (roomId: string) => {
    const room = rooms.find(r => r.roomId === roomId);
    if (room) {
      socket.join(room.roomId);
      socketToRoom[socket.id] = room.roomId;
      console.log(`Socket ${socket.id} joined room: ${room.name}`);
      socket.emit('joinedRoom', room.name);
    }
  });

// Insert message into the database when it's sent
socket.on('sendMessage', async (message: { username: string; content: string; timestamp: string; roomID: string }) => {
  const roomId = socketToRoom[socket.id];  // Get the roomId from the server-side mapping
  if (roomId) {
    console.log(`Message received in room ${roomId}: ${message.content}`);
    
    try {
      await pool.query(
        'INSERT INTO messages (username, message, roomid) VALUES ($1, $2, $3)',
        [message.username, message.content, roomId]  // Use roomId from server-side, timestamp added
      );
      console.log('Message saved to database');
    } catch (err) {
      console.error('Error saving message to database:', err);
    }

    // Broadcast the message to all users in the room
    io.to(roomId).emit('receiveMessage', message);
  } else {
    console.log(`Socket ${socket.id} is not in any room.`);
  }
});


  socket.on('disconnect', () => {
    delete socketToRoom[socket.id];
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
