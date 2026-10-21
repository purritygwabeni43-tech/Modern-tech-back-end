
import { pool } from '../config/db.js';

const selectSql = `SELECT pr.review_id, pr.employee_id, e.name, e.position,
  pr.review_date, pr.score, pr.feedback, pr.reviewer
  FROM performance_reviews pr JOIN employees e ON e.employee_id = pr.employee_id`;

async function all() { const [rows] = await pool.query(`${selectSql} ORDER BY pr.review_date DESC, pr.review_id DESC`); return rows; }
async function byId(id) { const [rows] = await pool.query(`${selectSql} WHERE pr.review_id = ?`, [id]); return rows[0] || null; }
async function create(data) { const [result] = await pool.query('INSERT INTO performance_reviews (employee_id, review_date, score, feedback, reviewer) VALUES (?, ?, ?, ?, ?)', [data.employee_id, data.review_date, data.score, data.feedback || null, data.reviewer || null]); return result.insertId; }
async function update(id, data) { const [result] = await pool.query('UPDATE performance_reviews SET employee_id = ?, review_date = ?, score = ?, feedback = ?, reviewer = ? WHERE review_id = ?', [data.employee_id, data.review_date, data.score, data.feedback || null, data.reviewer || null, id]); return result; }
async function remove(id) { const [result] = await pool.query('DELETE FROM performance_reviews WHERE review_id = ?', [id]); return result; }

export { all, byId, create, update, remove };
