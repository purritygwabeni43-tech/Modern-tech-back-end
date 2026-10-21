
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

async function findByIdentifier(identifier){
  const [rows]=await pool.query(`SELECT u.id,u.employee_id,u.full_name,u.email,u.username,u.password_hash,u.is_active,u.role_id,r.role_name,e.position,d.department_name FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN employees e ON e.employee_id=u.employee_id LEFT JOIN departments d ON d.department_id=e.department_id WHERE u.username=? OR u.email=? LIMIT 1`,[identifier,identifier]);
  return rows[0]||null;
}
async function findById(id){ const [rows]=await pool.query(`SELECT u.id,u.employee_id,u.full_name,u.email,u.username,u.password_hash,u.is_active,u.role_id,r.role_name FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=?`,[id]); return rows[0]||null; }
async function verifyPassword(password,user){
  if(!user) return false;
  if(String(user.password_hash).startsWith('$2')) return bcrypt.compare(password,user.password_hash);
  const ok=password===user.password_hash;
  if(ok){ const hash=await bcrypt.hash(password,12); await pool.query('UPDATE users SET password_hash=? WHERE id=?',[hash,user.id]); user.password_hash=hash; }
  return ok;
}
async function list(){ const [rows]=await pool.query(`SELECT u.id,u.employee_id,u.full_name,u.email,u.username,u.is_active,u.role_id,r.role_name FROM users u JOIN roles r ON r.id=u.role_id ORDER BY u.id`); return rows; }
async function roleId(role){
  if(Number.isInteger(Number(role)) && Number(role)>0){ const [rows]=await pool.query('SELECT id FROM roles WHERE id=?',[Number(role)]); return rows[0]?.id||null; }
  const [rows]=await pool.query('SELECT id FROM roles WHERE UPPER(role_name)=UPPER(?)',[String(role||'Employee')]); return rows[0]?.id||null;
}
async function create(data){
  const rid=await roleId(data.role_id||data.role||'Employee'); if(!rid){const e=new Error('Invalid role');e.status=400;throw e}
  const hash=await bcrypt.hash(data.password,12);
  const username=data.username||String(data.email).split('@')[0];
  const [result]=await pool.query(`INSERT INTO users(employee_id,full_name,email,username,password_hash,role_id,is_active) VALUES(?,?,?,?,?,?,1)`,[data.employee_id||null,data.full_name,data.email,username,hash,rid]);
  return findById(result.insertId);
}
async function changePassword(id,newPassword){ const hash=await bcrypt.hash(newPassword,12); await pool.query('UPDATE users SET password_hash=? WHERE id=?',[hash,id]); }
async function updateRole(id,role){ const rid=await roleId(role); if(!rid){const e=new Error('Invalid role');e.status=400;throw e} const [r]=await pool.query('UPDATE users SET role_id=? WHERE id=?',[rid,id]); return r; }
async function remove(id){ const [r]=await pool.query('DELETE FROM users WHERE id=?',[id]); return r; }
export {findByIdentifier,findById,verifyPassword,list,create,changePassword,updateRole,remove};

