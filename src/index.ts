import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/students';
import logRequest from './middleware/logRequest';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logRequest);

app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express App!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
