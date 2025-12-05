const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf8')) || [];
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function ensureDemoUser() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const users = readUsers();
  const email = 'demo@local';
  let user = users.find(u => u.email === email);
  if (!user) {
    user = { id: uuidv4(), name: 'Demo User', email, password: 'password' };
    users.push(user);
    writeUsers(users);
    console.log('Created demo user:', user);
  } else {
    console.log('Demo user already exists:', user);
  }
  return user;
}

if (require.main === module) {
  try {
    const u = ensureDemoUser();
    console.log('Done. Login with:', u.email, 'password:', u.password);
  } catch (err) {
    console.error('Failed to create demo user:', err);
    process.exit(1);
  }
}

module.exports = { ensureDemoUser };
