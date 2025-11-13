const bcrypt = require('bcryptjs');

async function createHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL Command:');
  console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
}

createHash();
