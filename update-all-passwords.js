// Create update-all-passwords.js
import pool from './config/db.js';
import bcrypt from 'bcrypt';

async function updateAllPasswords() {
    try {
        // Get all users
        const [users] = await pool.query('SELECT id, email FROM users');
        console.log(`📝 Found ${users.length} users to update\n`);

        // Generate new hash for "Password124"
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash('Password124', salt);
        console.log('🔑 New hash for "Password124":', newHash, '\n');

        // Update each user
        for (const user of users) {
            await pool.query(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [newHash, user.id]
            );
            console.log(`✅ Updated: ${user.email}`);
        }

        console.log('\n🎉 All passwords updated successfully!');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit();
    }
}

updateAllPasswords();