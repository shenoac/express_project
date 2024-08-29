import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const rooms: { roomId: string; name: string }[] = [];
const socketToRoom: { [socketId: string]: string } = {};  // Mapping of socket IDs to room IDs

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

  socket.on('createRoom', (roomName: string) => {
    const roomId = uuidv4();
    const newRoom = { roomId, name: roomName };
    rooms.push(newRoom);
    socket.join(roomId);
    socketToRoom[socket.id] = roomId;  // Map this socket to the newly created room
    io.emit('rooms', rooms.map(room => room.name));  // Broadcast updated room list
  });

  socket.on('joinRoom', (roomName: string) => {
    const room = rooms.find(r => r.name === roomName);
    if (room) {
      socket.join(room.roomId);
      socketToRoom[socket.id] = room.roomId;  // Map this socket to the joined room
      console.log(`Socket ${socket.id} joined room: ${roomName}`);
      socket.emit('joinedRoom', roomName);
    }
  });

  socket.on('leaveRoom', (roomName: string) => {
    const room = rooms.find(r => r.name === roomName);
    if (room) {
      socket.leave(room.roomId);
      delete socketToRoom[socket.id];  // Remove this socket's room mapping
      console.log(`Socket ${socket.id} left room: ${roomName}`);
    }
  });

  socket.on('sendMessage', (message: string) => {
    const roomId = socketToRoom[socket.id];  // Get the room ID from the mapping
    if (roomId) {
      console.log(`Message received in room ${roomId}: ${message}`);
      io.to(roomId).emit('receiveMessage', message);  // Send to specific room
    } else {
      console.log(`Socket ${socket.id} is not in any room.`);
    }
  });

  socket.on('disconnect', () => {
    delete socketToRoom[socket.id];  // Clean up the room mapping on disconnect
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
