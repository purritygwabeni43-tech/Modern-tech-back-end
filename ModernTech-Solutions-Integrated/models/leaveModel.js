
import { pool } from '../config/db.js';
async function all(employeeId){let sql=`SELECT l.leave_id,l.employee_id,e.name,e.position,l.leave_date,l.reason,l.status FROM leave_requests l JOIN employees e ON e.employee_id=l.employee_id`;const a=[];if(employeeId){sql+=' WHERE l.employee_id=?';a.push(employeeId)}sql+=' ORDER BY l.leave_date DESC,l.leave_id DESC';const[r]=await pool.query(sql,a);return r}
async function create(d){const[r]=await pool.query('INSERT INTO leave_requests(employee_id,leave_date,reason,status) VALUES(?,?,?,?)',[d.employee_id,d.leave_date,d.reason,'Pending']);return r.insertId}
async function status(id,status){const[r]=await pool.query('UPDATE leave_requests SET status=? WHERE leave_id=?',[status,id]);return r}
async function byId(id){const [rows]=await pool.query('SELECT l.leave_id,l.employee_id,e.name,e.position,l.leave_date,l.reason,l.status FROM leave_requests l JOIN employees e ON e.employee_id=l.employee_id WHERE l.leave_id=?',[id]);return rows[0]||null}
async function update(id,data){const [result]=await pool.query('UPDATE leave_requests SET employee_id=?,leave_date=?,reason=?,status=? WHERE leave_id=?',[data.employee_id,data.leave_date,data.reason,data.status||'Pending',id]);return result}
async function remove(id){const [result]=await pool.query('DELETE FROM leave_requests WHERE leave_id=?',[id]);return result}
export { all, byId, create, update, remove, status };

