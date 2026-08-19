const { pool } = require('../config/db');

class AttendanceModel {
    // Get attendance for specific employee
    static async getEmployeeAttendance(employeeId, month, year) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    attendance_date as date,
                    status,
                    attendance_id
                FROM attendance 
                WHERE employee_id = ? 
                AND MONTH(attendance_date) = ? 
                AND YEAR(attendance_date) = ?
                ORDER BY attendance_date`,
                [employeeId, month || 8, year || 2026]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching attendance:', error);
            throw error;
        }
    }

    // Get attendance summary for all employees
    static async getAllAttendanceSummary() {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    e.employee_id,
                    e.name,
                    e.position,
                    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present,
                    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
                    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late,
                    COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) as leave_count
                FROM employees e
                LEFT JOIN attendance a ON e.employee_id = a.employee_id 
                    AND MONTH(a.attendance_date) = 8 
                    AND YEAR(a.attendance_date) = 2026
                GROUP BY e.employee_id, e.name, e.position
                ORDER BY e.employee_id`
            );
            return rows;
        } catch (error) {
            console.error('Error fetching attendance summary:', error);
            throw error;
        }
    }

    // Get monthly attendance for all employees
    static async getMonthlyAttendance(month, year) {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    e.employee_id,
                    e.name,
                    a.attendance_date,
                    a.status
                FROM employees e
                LEFT JOIN attendance a ON e.employee_id = a.employee_id 
                    AND MONTH(a.attendance_date) = ? 
                    AND YEAR(a.attendance_date) = ?
                ORDER BY e.employee_id, a.attendance_date`,
                [month || 8, year || 2026]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching monthly attendance:', error);
            throw error;
        }
    }
}

module.exports = AttendanceModel;