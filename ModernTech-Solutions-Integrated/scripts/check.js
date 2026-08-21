
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const must=['public/login.html','public/dashboard.html','public/employees.html','public/attendance.html','public/leave.html','public/payroll.html','public/reports.html','database/modern_tech.sql','.env.example'];
const missing=must.filter(f=>!fs.existsSync(path.join(root,f)));if(missing.length){console.error('Missing:',missing);process.exit(1)}console.log('Project structure check passed.');

