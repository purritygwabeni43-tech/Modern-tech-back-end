const { pool } = require('../config/db');

class EmployeeModel {
    // Get all employees
    static async getAllEmployees() {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    employee_id,
                    name,
                    position,
                    department_id,
                    salary,
                    contact
                FROM employees 
                ORDER BY employee_id`
            );
            return rows;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    // Get employee by ID
    static async getEmployeeById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    e.*,
                    d.department_name
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.department_id
                WHERE e.employee_id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    }

    // Get employee with attendance stats
    static async getEmployeeWithStats(id) {
        try {
            const [employee] = await pool.query(
                `SELECT 
                    e.*,
                    d.department_name
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.department_id
                WHERE e.employee_id = ?`,
                [id]
            );
            
            if (!employee[0]) return null;
            
            const [stats] = await pool.query(
                `SELECT 
                    COUNT(CASE WHEN status = 'Present' THEN 1 END) as present,
                    COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent,
                    COUNT(CASE WHEN status = 'Late' THEN 1 END) as late,
                    COUNT(CASE WHEN status = 'Leave' THEN 1 END) as leave_count
                FROM attendance 
                WHERE employee_id = ? 
                AND MONTH(attendance_date) = 8 
                AND YEAR(attendance_date) = 2026`,
                [id]
            );
            
            const [reviews] = await pool.query(
                `SELECT 
                    review_date,
                    score,
                    feedback,
                    reviewer
                FROM performance_reviews 
                WHERE employee_id = ?
                ORDER BY review_date DESC`,
                [id]
            );
            
            return {
                ...employee[0],
                stats: stats[0],
                reviews: reviews
            };
        } catch (error) {
            console.error('Error fetching employee with stats:', error);
            throw error;
        }
    }

    // Get employees by department
    static async getEmployeesByDepartment(departmentId) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    employee_id,
                    name,
                    position,
                    salary,
                    contact
                FROM employees 
                WHERE department_id = ?
                ORDER BY name`,
                [departmentId]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching employees by department:', error);
            throw error;
        }
    }
}

module.exports = EmployeeModel;