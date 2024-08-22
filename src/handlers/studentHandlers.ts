import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Handler to get all students (with optional grade filter)
export const getAllStudents = async (req: Request, res: Response) => {
  const grade = req.query.grade as string;

  try {
    let query = 'SELECT * FROM students';
    let params: any[] = [];

    if (grade) {
      query += ' WHERE grade = $1';
      params.push(grade);
    }


    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handler to get a specific student by ID
export const getStudentById = async (req: Request, res: Response) => {
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
};

// Handler to create one or multiple students
export const createStudents = async (req: Request, res: Response) => {
  const newStudents = Array.isArray(req.body) ? req.body : [req.body];

  if (newStudents.length === 0) {
    return res.status(400).json({ error: 'Request body must contain at least one student' });
  }

  try {
    await pool.query('BEGIN');

    const insertedStudents = [];
    for (const student of newStudents) {
      const { name, grade } = student;

      if (!name || !grade) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: 'Each student must have a name and grade' });
      }

      const result = await pool.query(
        'INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING *',
        [name, grade]
      );
      insertedStudents.push(result.rows[0]);
    }

    await pool.query('COMMIT');
    res.status(201).json(insertedStudents.length === 1 ? insertedStudents[0] : insertedStudents);
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handler to update a student's grade
export const updateStudentGrade = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id);
  const { grade } = req.body;

  try {
    const result = await pool.query(
      'UPDATE students SET grade = $1 WHERE id = $2 RETURNING *',
      [grade, studentId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handler to delete a student
export const deleteStudent = async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id);

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [studentId]);

    if (result.rows.length > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error executing query:', err instanceof Error ? err.stack : err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
