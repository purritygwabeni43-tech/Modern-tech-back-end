
import { Router } from 'express';
import { all, one, create, update, remove, status } from '../controllers/leaveController.js';
const router = Router();
router.get('/', all); router.get('/:id', one); router.post('/', create); router.put('/:id/status', status); router.put('/:id', update); router.delete('/:id', remove);
export default router;

