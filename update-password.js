import pool from './config/db.js';

const email = 'lungile@moderntech.com';
const newHash = '$2b$10$CGA9iragrQwXmLRVn.IlUeYUkau.mjmgZ7bsAvyXiFM5Gsw.2tZsG';

async function updatePassword() {
    try {
        // Update the password
        await pool.query(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [newHash, email]
        );
        
        console.log(`✅ Password updated for ${email}`);
        
        // Verify the update
        const [rows] = await pool.query(
            'SELECT id, email, password_hash FROM users WHERE email = ?',
            [email]
        );
        
        if (rows.length > 0) {
            console.log('✅ User found:', rows[0].email);
            console.log('✅ Password hash updated successfully!');
        } else {
            console.log('❌ User not found!');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit();
    }
}

updatePassword();