
import { Router } from 'express';
import { all, one, employee, eligibleEmployees, create, update, remove } from '../controllers/payrollController.js';
const router = Router();
router.get('/', all); router.get('/employee/:employee_id', employee); router.get('/eligible-employees', eligibleEmployees); router.get('/:id', one); router.post('/', create); router.put('/:id', update); router.delete('/:id', remove);
export default router;

