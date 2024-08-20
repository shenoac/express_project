import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
dotenv.config();


// Create or open the SQLite database
const db = new sqlite3.Database('./db/users.db'); // File-based database

// Create a 'users' table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
});

const app = express();
const port = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(express.json());

// GET route to fetch all users
app.get('/users', (req: Request, res: Response) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

app.get('/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;

  // Query the database to get the user by ID
  const query = "SELECT * FROM users WHERE id = ?";
  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(row);
  });
});


// POST route to add a new user
app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.run(query, [name, email], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, email });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
