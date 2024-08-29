import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const rooms: { roomId: string; name: string }[] = [];

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
    io.emit('rooms', rooms.map(room => room.name));  // Broadcast updated room list
  });

  socket.on('sendMessage', (message: string) => {
    console.log(`Message received: ${message}`);
    // Broadcast the message to all clients
    io.emit('receiveMessage', message);
  });


  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
