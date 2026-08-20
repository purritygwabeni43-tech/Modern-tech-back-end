import express from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);

// Admin/HR only routes
router.get('/admin/users', authenticate, authorize('HR', 'Admin'), (req, res) => {
    // Only HR and Admin can access this
    res.json({ message: 'Admin route accessed' });
});

export default router;