
import { pool } from '../config/db.js';

async function summary() {
  const [[employees]] = await pool.query('SELECT COUNT(*) AS totalEmployees, COALESCE(AVG(salary), 0) AS averageSalary FROM employees');
  const [[payroll]] = await pool.query('SELECT COALESCE(SUM(final_salary), 0) AS totalPayroll, COALESCE(SUM(leave_deductions), 0) AS totalLeaveDeductions FROM payroll');
  const [[attendance]] = await pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(status='Present'), 0) AS present, COALESCE(SUM(status='Absent'), 0) AS absent, COALESCE(SUM(status='Late'), 0) AS late FROM attendance");
  const [[leave]] = await pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(status='Pending'), 0) AS pending, COALESCE(SUM(status='Approved'), 0) AS approved, COALESCE(SUM(status='Denied'), 0) AS denied FROM leave_requests");
  const [[reviews]] = await pool.query('SELECT COUNT(*) AS total, COALESCE(AVG(score), 0) AS averageScore FROM performance_reviews');
  const [departmentPerformance] = await pool.query(`SELECT d.department_name AS department, COALESCE(ROUND(AVG(pr.score) * 20, 0), 0) AS performance_score FROM departments d LEFT JOIN employees e ON e.department_id = d.department_id LEFT JOIN performance_reviews pr ON pr.employee_id = e.employee_id GROUP BY d.department_id, d.department_name ORDER BY performance_score DESC, d.department_name`);
  const [recentFeedback] = await pool.query(`SELECT e.name, pr.score, pr.feedback, pr.reviewer, pr.review_date FROM performance_reviews pr JOIN employees e ON e.employee_id = pr.employee_id ORDER BY pr.review_date DESC, pr.review_id DESC LIMIT 5`);
  const [recentEmployees] = await pool.query('SELECT employee_id, name, position, salary FROM employees ORDER BY employee_id DESC LIMIT 5');
  const [recentPayroll] = await pool.query('SELECT p.payroll_id, e.name AS employee_name, p.final_salary FROM payroll p JOIN employees e ON e.employee_id=p.employee_id ORDER BY p.payroll_id DESC LIMIT 5');
  return { employees, payroll, attendance, leave, reviews, departmentPerformance, recentFeedback, recentEmployees, recentPayroll };
}

export { summary };
