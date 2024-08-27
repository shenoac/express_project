import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudents,
  updateStudentGrade,
  deleteStudent,
} from '../handlers/studentHandlers';

const router = Router();

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudents);
router.put('/:id', updateStudentGrade);
router.delete('/:id', deleteStudent);

export default router;
