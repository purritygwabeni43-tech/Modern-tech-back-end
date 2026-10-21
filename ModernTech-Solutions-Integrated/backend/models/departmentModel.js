
import { pool } from '../config/db.js';
async function all(){ const [rows]=await pool.query('SELECT department_id, department_name FROM departments ORDER BY department_id'); return rows; }
export { all };

