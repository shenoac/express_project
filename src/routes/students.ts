import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

// Initialize the router
const router = Router();

// Create a pool of connections using the DATABASE_URL from the environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for secure connections in production (Heroku)
  },
});

// GET all students
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific student by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new student
router.post('/', async (req: Request, res: Response) => {
  const { name, grade } = req.body;

  try {
    const result = await pool.query('INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING *', [name, grade]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update a student's grade
router.put('/:id', async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id);
  const { grade } = req.body;

  try {
    const result = await pool.query('UPDATE students SET grade = $1 WHERE id = $2 RETURNING *', [grade, studentId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a student
router.delete('/:id', async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id);

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [studentId]);

    if (result.rows.length > 0) {
      res.status(204).send(); // No content after deletion
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
