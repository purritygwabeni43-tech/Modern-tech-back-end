import db from "../config/db.js";

const findUserByUsername = async (username) => {
    const [rows] = await db.query(
        `SELECT
            user_id,
            employee_id,
            username,
            password_hash,
            role,
            is_active
         FROM users
         WHERE username = ?`,
        [username]
    );

    return rows[0];
};

export { findUserByUsername };