import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/students';
import logRequest from './middleware/logRequest';
import fs from 'fs';
import https from 'https';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logRequest);

app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express App!');
});

// Load SSL certificates
const privateKey = fs.readFileSync(__dirname + '/privatekey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');

// Create HTTPS server
https.createServer({
  key: privateKey,
  cert: certificate,
}, app).listen(port, () => {
  console.log(`Server is running securely on https://localhost:${port}`);
});

export default app;
