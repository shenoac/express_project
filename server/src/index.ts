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

const app = express();
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://express-project-1b7b8f3ee21b.herokuapp.com/'
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


const rooms: { roomId: string; name: string }[] = [];

// Load rooms from the database and ensure they're initialized in Socket.IO
(async () => {
  try {
    const result = await pool.query('SELECT roomid, name FROM rooms');
    result.rows.forEach((room: { roomid: string; name: string }) => {
      rooms.push({ roomId: room.roomid, name: room.name }); // Map roomid to roomId
      io.of('/').adapter.rooms.set(room.roomid, new Set()); 
    });
    console.log('Rooms loaded from database:', rooms);
  } catch (err) {
    console.error('Error loading rooms from database:', err);
  }
})();


const socketToRoom: { [socketId: string]: string } = {};

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

io.on('connection', (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.emit('rooms', rooms);

  socket.on('setUsername', (username: string) => {
    socket.data.username = username;
    console.log(`Username set for socket ${socket.id}: ${username}`);
  });

  socket.on('createRoom', async (roomName: string) => {
    const roomId = uuidv4();  // Generate a unique ID for the room
    const newRoom = { roomId, name: roomName };
  
    try {
      // Save the new room to the database
      await pool.query(
        'INSERT INTO rooms (roomid, name) VALUES ($1, $2)',
        [roomId, roomName]
      );
      rooms.push(newRoom);  // Add the new room to the in-memory list
      socket.join(roomId);  // Join the socket to the room
      socketToRoom[socket.id] = roomId;  // Map the socket ID to the room ID
      io.emit('rooms', rooms);  // Broadcast the updated room list to all clients
    } catch (err) {
      console.error('Error saving room to database:', err);
    }
  });
  
  socket.on('joinRoom', (roomId: string) => {
    console.log(`Attempting to join room: ${roomId}`);
    
    const room = rooms.find(r => r.roomId === roomId);
    if (room) {
      socket.join(room.roomId);
      socketToRoom[socket.id] = room.roomId;
      console.log(`Socket ${socket.id} successfully joined room: ${room.name}`);
      console.log(`Current socketToRoom mapping: ${JSON.stringify(socketToRoom)}`);
      socket.emit('joinedRoom', room.name);
    } else {
      console.log(`Room with ID ${roomId} not found.`);
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('sendMessage', async (message: { username: string; content: string; timestamp: string; roomID: string }) => {
    const roomId = socketToRoom[socket.id];
    console.log(`Current socketToRoom mapping: ${JSON.stringify(socketToRoom)}`);
    
    if (roomId) {
      console.log(`Message received in room ${roomId}: ${message.content}`);
      
      try {
        await pool.query(
          'INSERT INTO messages (username, message, roomid) VALUES ($1, $2, $3)',
          [message.username, message.content, roomId]
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