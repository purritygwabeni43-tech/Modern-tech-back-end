
import { Router } from 'express';
import * as c from '../controllers/authController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
const router=Router();
router.post('/login',c.login);
router.post('/logout',c.logout);
router.get('/me',authenticateToken,c.me);
router.put('/change-password',authenticateToken,c.changePassword);
router.post('/register',authenticateToken,requireRole('HR'),c.register);
router.get('/users',authenticateToken,requireRole('HR'),c.users);
router.put('/users/:id/role',authenticateToken,requireRole('HR'),c.updateRole);
router.delete('/users/:id',authenticateToken,requireRole('HR'),c.removeUser);
export default router;

