const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken, authorize } = require('../middleware/auth');

// ==================== PUBLIC ROUTES ====================
// Login - anyone can access
router.post('/login', AuthController.login);

// Logout - anyone can access (client side)
router.post('/logout', AuthController.logout);

// ==================== PROTECTED ROUTES ====================
// Get current user profile - requires authentication
router.get('/me', authenticateToken, AuthController.getProfile);

// Change password - requires authentication
router.put('/change-password', authenticateToken, AuthController.changePassword);

// ==================== HR ONLY ROUTES ====================
// Register new user - HR only
router.post('/register', authenticateToken, authorize('HR'), AuthController.register);

// Get all users - HR only
router.get('/users', authenticateToken, authorize('HR'), AuthController.getAllUsers);

// Update user role - HR only
router.put('/users/:id/role', authenticateToken, authorize('HR'), AuthController.updateRole);

module.exports = router;