const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            user_id: user.id,
            employee_id: user.employee_id || null,
            email: user.email,
            full_name: user.full_name,
            role: user.role_name,
            role_id: user.role_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Auth Controller - Handles authentication logic
const AuthController = {
    // User Registration (HR only)
    register: async (req, res) => {
        try {
            const { full_name, email, password, role_id } = req.body;

            // Validate input
            if (!full_name || !email || !password) {
                return res.status(400).json({ 
                    error: 'Missing required fields: full_name, email, password' 
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Validate password strength
            if (password.length < 6) {
                return res.status(400).json({ 
                    error: 'Password must be at least 6 characters long' 
                });
            }

            // Create user
            const newUser = await UserModel.create(full_name, email, password, role_id);
            
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    full_name: newUser.full_name,
                    email: newUser.email,
                    role_id: newUser.role_id
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.message === 'Email already registered') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Registration failed. Please try again.' });
        }
    },

    // User Login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ 
                    error: 'Email and password required' 
                });
            }

            // Find user by email with employee details
            const user = await UserModel.getUserWithEmployee(email);
            
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = UserModel.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = generateToken(user);

            // Remove sensitive data from response
            delete user.password_hash;

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role_name,
                    role_id: user.role_id,
                    employee_id: user.employee_id || null,
                    employee_name: user.employee_name || null,
                    position: user.position || null,
                    department: user.department_name || null
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed. Please try again.' });
        }
    },

    // Get current user profile
    getProfile: async (req, res) => {
        try {
            const userId = req.user.user_id;
            const user = await UserModel.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Remove sensitive data
            delete user.password_hash;

            res.json(user);
        } catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    },

    // Get all users (HR only)
    getAllUsers: async (req, res) => {
        try {
            // Check if user is HR
            if (req.user.role !== 'HR') {
                return res.status(403).json({ 
                    error: 'Access denied. HR role required.' 
                });
            }

            const users = await UserModel.findAll();
            res.json(users);
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    // Update user role (HR only)
    updateRole: async (req, res) => {
        try {
            const userId = req.params.id;
            const { role_id } = req.body;

            // Check if user is HR
            if (req.user.role !== 'HR') {
                return res.status(403).json({ 
                    error: 'Access denied. HR role required.' 
                });
            }

            if (!role_id || isNaN(role_id)) {
                return res.status(400).json({ error: 'Valid role_id required' });
            }

            const result = await UserModel.updateRole(userId, role_id);
            res.json(result);
        } catch (error) {
            console.error('Update role error:', error);
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to update user role' });
        }
    },

    // Change password (authenticated users)
    changePassword: async (req, res) => {
        try {
            const userId = req.user.user_id;
            const { current_password, new_password } = req.body;

            if (!current_password || !new_password) {
                return res.status(400).json({ 
                    error: 'Current password and new password required' 
                });
            }

            if (new_password.length < 6) {
                return res.status(400).json({ 
                    error: 'New password must be at least 6 characters long' 
                });
            }

            // Get user with password
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify current password
            const isValid = UserModel.verifyPassword(current_password, user.password_hash);
            if (!isValid) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            // Hash new password
            const hashedPassword = UserModel.hashPassword(new_password);

            // Update password
            const query = 'UPDATE users SET password_hash = ? WHERE id = ?';
            const db = require('mysql2').createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            db.query(query, [hashedPassword, userId], (err) => {
                if (err) {
                    console.error('Password update error:', err);
                    return res.status(500).json({ error: 'Failed to update password' });
                }
                res.json({ message: 'Password updated successfully' });
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Failed to change password' });
        }
    },

    // Logout (client-side only - invalidate token)
    logout: async (req, res) => {
        // JWT is stateless - just inform client to delete token
        res.json({ 
            message: 'Logout successful. Please delete the token on client side.' 
        });
    }
};

module.exports = AuthController;