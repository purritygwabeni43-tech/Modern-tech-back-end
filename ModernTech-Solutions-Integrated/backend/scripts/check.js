
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const projectRoot = path.dirname(backendRoot);
const requiredFiles = [
  'frontend/login.html',
  'frontend/dashboard.html',
  'frontend/employees.html',
  'frontend/attendance.html',
  'frontend/leave.html',
  'frontend/payroll.html',
  'frontend/reports.html',
  'backend/database/modern_tech.sql',
  'backend/.env.example'
];
const missing = requiredFiles.filter(file => !fs.existsSync(path.join(projectRoot, file)));

if (missing.length) {
  console.error('Missing project files:', missing);
  process.exit(1);
}

console.log('Project structure check passed.');
