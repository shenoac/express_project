// Server (index.ts)
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

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

  socket.on('sendMessage', (message: { username: string; content: string; timestamp: string }) => {
    const roomId = socketToRoom[socket.id];
    if (roomId) {
      console.log(`Message received in room ${roomId}: ${message.content}`);
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
