
import { Router } from 'express';
import { all } from '../controllers/departmentController.js';
const router=Router();
router.get('/', all);
export default router;

