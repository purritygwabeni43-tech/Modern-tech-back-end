
import { pool } from '../config/db.js';
async function all(employeeId){let sql=`SELECT a.attendance_id,a.employee_id,e.name,e.position,a.attendance_date,a.status FROM attendance a JOIN employees e ON e.employee_id=a.employee_id`;const args=[];if(employeeId){sql+=' WHERE a.employee_id=?';args.push(employeeId)}sql+=' ORDER BY a.attendance_date DESC,a.attendance_id DESC';const [r]=await pool.query(sql,args);return r}
async function byId(id){const [rows]=await pool.query('SELECT a.attendance_id,a.employee_id,e.name,e.position,a.attendance_date,a.status FROM attendance a JOIN employees e ON e.employee_id=a.employee_id WHERE a.attendance_id=?',[id]);return rows[0]||null}
async function create(data){const [result]=await pool.query('INSERT INTO attendance(employee_id,attendance_date,status) VALUES(?,?,?)',[data.employee_id,data.attendance_date,data.status]);return result.insertId}
async function update(id,data){const [result]=await pool.query('UPDATE attendance SET employee_id=?,attendance_date=?,status=? WHERE attendance_id=?',[data.employee_id,data.attendance_date,data.status,id]);return result}
async function remove(id){const [result]=await pool.query('DELETE FROM attendance WHERE attendance_id=?',[id]);return result}
export { all, byId, create, update, remove };

