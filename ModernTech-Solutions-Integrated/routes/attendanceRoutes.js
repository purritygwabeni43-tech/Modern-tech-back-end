
import { Router } from 'express';
import { all, one, create, update, remove } from '../controllers/attendanceController.js';
const router = Router();
router.get('/', all); router.get('/:id', one); router.post('/', create); router.put('/:id', update); router.delete('/:id', remove);
export default router;

