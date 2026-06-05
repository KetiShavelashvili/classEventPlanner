import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const USERS_FILE = join(__dirname, 'users.json');

function seedUsers() {
  const users = [
    {
      id: '1',
      username: 'teacher1',
      passwordHash: bcrypt.hashSync('teacher123', 10),
      role: 'teacher'
    },
    {
      id: '2',
      username: 'student1',
      passwordHash: bcrypt.hashSync('student123', 10),
      role: 'student'
    }
  ];
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

if (!existsSync(USERS_FILE)) {
  seedUsers();
}

export function readUsers() {
  return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
}

export function writeUsers(users) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
