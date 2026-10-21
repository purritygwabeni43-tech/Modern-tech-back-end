
import { pool } from '../config/db.js';
const selectSql = `SELECT p.*, e.name AS employee_name, e.position, e.salary,
	(e.salary / 160) AS hourly_rate, ((e.salary / 160) * 8) AS daily_rate,
	((e.salary / 160) * p.hours_worked) AS gross_salary,
	((e.salary / 160) * 8 * p.leave_deductions) AS deduction_amount
	FROM payroll p JOIN employees e ON e.employee_id=p.employee_id`;
async function all(){const [r]=await pool.query(`${selectSql} ORDER BY p.payroll_id`);return r}
async function byId(id){const [r]=await pool.query(`${selectSql} WHERE p.payroll_id=?`,[id]);return r[0]||null}
async function byEmployee(id){const [r]=await pool.query(`${selectSql} WHERE p.employee_id=? ORDER BY p.payroll_id DESC`,[id]);return r}
async function eligibleEmployees(){const [r]=await pool.query(`SELECT e.employee_id,e.name,e.position,e.salary FROM employees e LEFT JOIN payroll p ON p.employee_id=e.employee_id WHERE p.payroll_id IS NULL ORDER BY e.name`);return r}
async function salaryForEmployee(employeeId){const [rows]=await pool.query('SELECT employee_id,salary FROM employees WHERE employee_id=?',[employeeId]);if(!rows.length){const error=new Error('Employee does not exist.');error.status=404;throw error}return Number(rows[0].salary)}
function calculate(salary,hours,leaveDays){const hourlyRate=salary/160;const dailyRate=hourlyRate*8;const grossSalary=hourlyRate*hours;const deductionAmount=dailyRate*leaveDays;return {finalSalary:grossSalary-deductionAmount}}
async function create(d){const salary=await salaryForEmployee(d.employee_id);const {finalSalary}=calculate(salary,d.hours_worked,d.leave_deductions);const [r]=await pool.query('INSERT INTO payroll(employee_id,hours_worked,leave_deductions,final_salary) VALUES(?,?,?,?)',[d.employee_id,d.hours_worked,d.leave_deductions,finalSalary]);return r.insertId}
async function update(id,d){const salary=await salaryForEmployee(d.employee_id);const {finalSalary}=calculate(salary,d.hours_worked,d.leave_deductions);const [r]=await pool.query('UPDATE payroll SET employee_id=?,hours_worked=?,leave_deductions=?,final_salary=? WHERE payroll_id=?',[d.employee_id,d.hours_worked,d.leave_deductions,finalSalary,id]);return r}
async function remove(id){const [r]=await pool.query('DELETE FROM payroll WHERE payroll_id=?',[id]);return r}
export { all, byId, byEmployee, eligibleEmployees, create, update, remove };

