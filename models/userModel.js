const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('User model connected to database');
});

// User Model - All database operations for users
const UserModel = {
    // Create a new user
    create: (full_name, email, password, role_id) => {
        return new Promise((resolve, reject) => {
            // Check if email exists
            db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) {
                    return reject(new Error('Email already registered'));
                }

                // Hash password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);

                // Insert user
                const query = `
                    INSERT INTO users (full_name, email, password_hash, role_id)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(query, [full_name, email, hashedPassword, role_id || 3], (err, result) => {
                    if (err) return reject(err);
                    resolve({
                        id: result.insertId,
                        full_name,
                        email,
                        role_id: role_id || 3
                    });
                });
            });
        });
    },

    // Find user by email (for login)
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.*, r.role_name
                FROM users u
                JOIN roles r ON u.role_id = r.id
                WHERE u.email = ?
            `;
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    // Find user by ID
    findById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.*, r.role_name
                FROM users u
                JOIN roles r ON u.role_id = r.id
                WHERE u.id = ?
            `;
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    // Get all users (for HR only)
    findAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id, u.full_name, u.email, u.role_id, r.role_name, 
                       u.created_at, u.updated_at
                FROM users u
                JOIN roles r ON u.role_id = r.id
                ORDER BY u.id
            `;
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Update user role (HR only)
    updateRole: (userId, roleId) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET role_id = ? WHERE id = ?';
            db.query(query, [roleId, userId], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) {
                    return reject(new Error('User not found'));
                }
                resolve({ message: 'User role updated successfully' });
            });
        });
    },

    // Get user with employee details
    getUserWithEmployee: (email) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.*, r.role_name, e.employee_id, e.name as employee_name,
                       e.position, e.department_id, d.department_name
                FROM users u
                JOIN roles r ON u.role_id = r.id
                LEFT JOIN employees e ON u.email = e.contact
                LEFT JOIN departments d ON e.department_id = d.department_id
                WHERE u.email = ?
            `;
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    // Verify password
    verifyPassword: (plainPassword, hashedPassword) => {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    },

    // Hash password
    hashPassword: (password) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
};

module.exports = UserModel;