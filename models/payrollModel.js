const { pool } = require('../config/db');

class PayrollModel {
    // Get payroll for all employees
    static async getAllPayroll() {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    p.*,
                    e.name,
                    e.position
                FROM payroll p
                JOIN employees e ON p.employee_id = e.employee_id
                ORDER BY e.employee_id`
            );
            return rows;
        } catch (error) {
            console.error('Error fetching payroll:', error);
            throw error;
        }
    }

    // Get payroll for a specific employee
    static async getPayrollByEmployee(employeeId) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    p.*,
                    e.name,
                    e.position
                FROM payroll p
                JOIN employees e ON p.employee_id = e.employee_id
                WHERE p.employee_id = ?`,
                [employeeId]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching payroll by employee:', error);
            throw error;
        }
    }

    // Get payroll summary
    static async getPayrollSummary() {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    ROUND(SUM(final_salary), 0) as total_payroll,
                    ROUND(AVG(final_salary), 0) as avg_salary,
                    COUNT(*) as employee_count,
                    ROUND(SUM(leave_deductions), 0) as total_deductions,
                    ROUND(SUM(hours_worked), 0) as total_hours
                FROM payroll`
            );
            return rows[0];
        } catch (error) {
            console.error('Error fetching payroll summary:', error);
            throw error;
        }
    }

    // Get payroll by department
    static async getPayrollByDepartment(departmentId) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    p.*,
                    e.name,
                    e.position
                FROM payroll p
                JOIN employees e ON p.employee_id = e.employee_id
                WHERE e.department_id = ?
                ORDER BY e.employee_id`,
                [departmentId]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching payroll by department:', error);
            throw error;
        }
    }
}

module.exports = PayrollModel;