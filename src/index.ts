import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

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

// Example route to test database connection
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    const error = err as Error;
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the pool to use it in other parts of your app if needed
export default pool;
