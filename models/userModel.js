import db from '../config/db.js';
import bcrypt from 'bcrypt';

const User = {
    // Find user by email with all details
    findByEmail: async (email) => {
        const query = `
            SELECT 
                u.id,
                u.full_name,
                u.email,
                u.password_hash,
                u.role_id,
                r.role_name as role,
                u.status,
                u.last_login_at,
                u.login_attempts,
                u.locked_until,
                u.created_at,
                u.updated_at,
                e.id as employee_id,
                e.initials,
                e.name as employee_name,
                e.role as job_role,
                e.department,
                e.phone,
                e.hire_date,
                e.salary,
                e.avatar_color,
                e.status as employment_status
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN employees e ON u.id = e.user_id
            WHERE u.email = ?
        `;
        const rows = await db.query(query, [email]);
        return rows[0] || null;
    },

    // Find user by ID
    findById: async (id) => {
        const query = `
            SELECT 
                u.id,
                u.full_name,
                u.email,
                u.role_id,
                r.role_name as role,
                u.status,
                u.last_login_at,
                u.created_at,
                u.updated_at,
                e.id as employee_id,
                e.name as employee_name,
                e.role as job_role,
                e.department,
                e.phone,
                e.hire_date,
                e.salary,
                e.avatar_color
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN employees e ON u.id = e.user_id
            WHERE u.id = ?
        `;
        const rows = await db.query(query, [id]);
        return rows[0] || null;
    },

    // Update last login
    updateLastLogin: async (id) => {
        const query = 'UPDATE users SET last_login_at = NOW() WHERE id = ?';
        await db.query(query, [id]);
    },

    // Reset login attempts
    resetLoginAttempts: async (email) => {
        const query = 'UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = ?';
        await db.query(query, [email]);
    },

    // Track login attempt
    trackLoginAttempt: async (email, success, ip, userAgent) => {
        const query = `
            INSERT INTO login_attempts (email, ip_address, user_agent, success) 
            VALUES (?, ?, ?, ?)
        `;
        await db.query(query, [email, ip, userAgent, success ? 1 : 0]);
    },

    // Get recent failed attempts
    getRecentFailedAttempts: async (email, minutes = 15) => {
        const query = `
            SELECT COUNT(*) as attempts 
            FROM login_attempts 
            WHERE email = ? 
            AND success = 0 
            AND attempted_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)
        `;
        const rows = await db.query(query, [email, minutes]);
        return rows[0]?.attempts || 0;
    },

    // Check if account is locked
    isAccountLocked: async (email) => {
        const query = `
            SELECT locked_until 
            FROM users 
            WHERE email = ? 
            AND locked_until > NOW()
        `;
        const rows = await db.query(query, [email]);
        return rows.length > 0;
    },

    // Lock account
    lockAccount: async (email, minutes = 30) => {
        const query = `
            UPDATE users 
            SET locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE)
            WHERE email = ?
        `;
        await db.query(query, [minutes, email]);
    },

    // Verify password
    verifyPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    // Hash password
    hashPassword: async (password) => {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        return await bcrypt.hash(password, saltRounds);
    }
};

export default User;