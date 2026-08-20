import bcrypt from 'bcrypt';

// The hash from your database (copy from MySQL)
const hashFromDB = '$2a$10$MpM.7E9kD8XqHhZ3bP9A8uZ6yQ5sT8NfW3V5X7Y9Z1B2C4D6E8F0G';
const passwordToTest = 'Password124';

console.log('🔍 Testing password...\n');

// Test the password
const isValid = await bcrypt.compare(passwordToTest, hashFromDB);
console.log('Password match:', isValid ? '✅ YES' : '❌ NO');

if (!isValid) {
    // Generate a new hash
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash('Password124', salt);
    console.log('\n💡 New hash for "Password124":');
    console.log(newHash);
    console.log('\n📝 Use this SQL to update the user:');
    console.log(`UPDATE users SET password_hash = '${newHash}' WHERE email = 'lungile@moderntech.com';`);
} else {
    console.log('\n✅ Password hash is correct!');
}