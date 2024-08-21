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
  const grade = req.query.grade as string;

  try {
    let query = 'SELECT * FROM students';
    let params: any[] = [];

    if (grade) {
      query += 'WHERE grade = $1';
      params.push(grade);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error'});
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

// POST one or multiple students
router.post('/', async (req: Request, res: Response) => {
  const newStudents = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single and multiple students

  // Validate that the request body contains students
  if (newStudents.length === 0) {
    return res.status(400).json({ error: 'Request body must contain at least one student' });
  }

  try {
    // Begin transaction to ensure atomicity
    await pool.query('BEGIN');
    
    const insertedStudents = [];
    for (const student of newStudents) {
      const { name, grade } = student;

      // Ensure that both name and grade are provided
      if (!name || !grade) {
        await pool.query('ROLLBACK'); // Rollback transaction in case of error
        return res.status(400).json({ error: 'Each student must have a name and grade' });
      }

      // Insert the student into the database
      const result = await pool.query('INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING *', [name, grade]);
      insertedStudents.push(result.rows[0]);
    }

    // Commit transaction
    await pool.query('COMMIT');
    res.status(201).json(insertedStudents.length === 1 ? insertedStudents[0] : insertedStudents); // Return single student or array of students
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    await pool.query('ROLLBACK'); // Rollback transaction in case of error
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
