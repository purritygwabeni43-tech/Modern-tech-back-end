const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const {
    authenticateToken,
    requireRole
} = require("./middleware/auth");

// ============================================
// IMPORT DASHBOARD ROUTES (ADD THIS LINE)
// ============================================
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabase() {
    try {
        const connection = await db.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

testDatabase();

// ============================================
// PUBLIC ROUTES
// ============================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Modern Tech API is running",
        version: "1.0.0"
    });
});

// ============================================
// AUTH ROUTES
// ============================================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const [existingUsers] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [roles] = await db.execute(
            "SELECT id FROM roles WHERE role_name = 'Employee'"
        );

        if (roles.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Employee role does not exist"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO users
            (full_name, email, password_hash, role_id)
            VALUES (?, ?, ?, ?)`,
            [full_name, email, passwordHash, roles[0].id]
        );

        res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            user: {
                id: result.insertId,
                full_name: full_name,
                email: email,
                role: "Employee"
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await db.execute(
            `SELECT
                users.id,
                users.full_name,
                users.email,
                users.password_hash,
                roles.role_name
             FROM users
             INNER JOIN roles
                ON users.role_id = roles.id
             WHERE users.email = ?`,
            [email]
        );
        console.log('Users found:', users); // Debug log to check the users array
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // ============================================
        // 🔍 DEBUG LOGS
        // ============================================
        console.log('=== LOGIN DEBUG ===');
        console.log('Email from request:', email);
        console.log('User found in DB:', user.email);
        console.log('User ID:', user.id);
        console.log('Role:', user.role_name);
        console.log('Password hash from DB:', user.password_hash);
        console.log('Password entered:', password);

        const passwordCorrect = await bcrypt.compare(password, user.password_hash);

        console.log('Password matched?', passwordCorrect);
        console.log('=== END DEBUG ===');
        // ============================================

        if (!passwordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role_name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

// ============================================
// PROTECTED ROUTES
// ============================================

app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT
                users.id,
                users.full_name,
                users.email,
                roles.role_name,
                users.created_at
             FROM users
             INNER JOIN roles
                ON users.role_id = roles.id
             WHERE users.id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve user"
        });
    }
});

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

app.get("/api/users", authenticateToken, async (req, res) => {
    try {
        let users;

        // HR - see all users
        if (req.user.role === "HR") {
            [users] = await db.execute(
                `SELECT
                    users.id,
                    users.full_name,
                    users.email,
                    roles.role_name,
                    users.created_at
                 FROM users
                 INNER JOIN roles
                    ON users.role_id = roles.id
                 ORDER BY users.id`
            );
        }
        // Manager - see employees and themselves
        else if (req.user.role === "Manager") {
            [users] = await db.execute(
                `SELECT
                    users.id,
                    users.full_name,
                    users.email,
                    roles.role_name,
                    users.created_at
                 FROM users
                 INNER JOIN roles
                    ON users.role_id = roles.id
                 WHERE roles.role_name = 'Employee'
                 OR users.id = ?
                 ORDER BY users.id`,
                [req.user.id]
            );
        }
        // Employee - see only themselves
        else {
            [users] = await db.execute(
                `SELECT
                    users.id,
                    users.full_name,
                    users.email,
                    roles.role_name,
                    users.created_at
                 FROM users
                 INNER JOIN roles
                    ON users.role_id = roles.id
                 WHERE users.id = ?`,
                [req.user.id]
            );
        }

        res.json({
            success: true,
            count: users.length,
            users: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve users"
        });
    }
});

app.get("/api/users/:id", authenticateToken, async (req, res) => {
    try {
        const requestedId = Number(req.params.id);

        // Employee can only view themselves
        if (req.user.role === "Employee" && requestedId !== Number(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Employees can only view their own information"
            });
        }

        const [users] = await db.execute(
            `SELECT
                users.id,
                users.full_name,
                users.email,
                roles.role_name,
                users.created_at
             FROM users
             INNER JOIN roles
                ON users.role_id = roles.id
             WHERE users.id = ?`,
            [requestedId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const requestedUser = users[0];

        // Manager can only view employees and themselves
        if (req.user.role === "Manager") {
            const allowed = requestedUser.role_name === "Employee" || requestedUser.id === Number(req.user.id);
            if (!allowed) {
                return res.status(403).json({
                    success: false,
                    message: "Managers can only view employees and themselves"
                });
            }
        }

        res.json({
            success: true,
            user: requestedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Could not retrieve user"
        });
    }
});

app.post("/api/users", authenticateToken, requireRole("HR"), async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, password and role are required"
            });
        }

        const allowedRoles = ["HR", "Manager", "Employee"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const [existing] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const [roles] = await db.execute(
            "SELECT id FROM roles WHERE role_name = ?",
            [role]
        );

        if (roles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            `INSERT INTO users
            (full_name, email, password_hash, role_id)
            VALUES (?, ?, ?, ?)`,
            [full_name, email, passwordHash, roles[0].id]
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: result.insertId,
                full_name: full_name,
                email: email,
                role: role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Could not create user"
        });
    }
});

app.delete("/api/users/:id", authenticateToken, requireRole("HR"), async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (userId === Number(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const [result] = await db.execute(
            "DELETE FROM users WHERE id = ?",
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Could not delete user"
        });
    }
});

// ============================================
// DASHBOARD ROUTES (ADD THIS SECTION HERE)
// ============================================

// Health check endpoint
app.get("/api/health", async (req, res) => {
    try {
        const connection = await db.getConnection();
        connection.release();
        res.status(200).json({
            success: true,
            status: 'OK',
            message: 'Server is running',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            status: 'OK',
            message: 'Server is running',
            database: 'Disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

// Mount dashboard routes (all dashboard endpoints will be under /api/dashboard)
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Modern Tech API running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});