import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/students';
import logRequest from './middleware/logRequest';
import fs from 'fs';
import https from 'https';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logRequest);

// Routes
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express App!');
});

// Load SSL certificates for HTTPS
const privateKey = fs.readFileSync(__dirname + '/privatekey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server with WebSocket support
const server = https.createServer(credentials, app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Echo the message back to the client
    ws.send(`Server says: ${message}`);
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running securely on https://localhost:${port}`);
});


export default app;
