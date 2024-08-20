import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import studentRoutes from './routes/students'; // Import the students routes


// Load environment variables from .env file (for local development)
dotenv.config();

// Create a pool of connections using the DATABASE_URL from the environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for secure connections in production (Heroku)
  },
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api/students', studentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express App!');
});


// Example route to test database connection
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server (this line is for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the app for Vercel
export default app;
