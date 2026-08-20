import pool from '../config/db.js';

const DashboardModel = {
    // Get all dashboard statistics
    getStats: async () => {
        const stats = {};

        // Total employees
        const [totalEmployees] = await pool.query('SELECT COUNT(*) as count FROM employees WHERE status = "active"');
        stats.totalEmployees = totalEmployees[0]?.count || 0;

        // Total departments
        const [totalDepartments] = await pool.query('SELECT COUNT(*) as count FROM departments');
        stats.totalDepartments = totalDepartments[0]?.count || 0;

        // Today's attendance
        const [todayAttendance] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as on_leave,
                SUM(CASE WHEN status = 'weekend' THEN 1 ELSE 0 END) as weekend
            FROM attendance 
            WHERE date = CURDATE()
        `);
        stats.todayAttendance = todayAttendance[0] || { total: 0, present: 0, absent: 0, late: 0, on_leave: 0, weekend: 0 };

        // Pending leave requests
        const [pendingLeaves] = await pool.query(`
            SELECT COUNT(*) as count 
            FROM leave_requests 
            WHERE status = 'pending'
        `);
        stats.pendingLeaves = pendingLeaves[0]?.count || 0;

        // Recent payroll (current month)
        const [recentPayroll] = await pool.query(`
            SELECT 
                SUM(net_pay) as total_payroll,
                COUNT(*) as employee_count,
                AVG(net_pay) as average_salary
            FROM payroll 
            WHERE month = DATE_FORMAT(CURDATE(), '%Y%m')
            AND payment_status = 'paid'
        `);
        stats.recentPayroll = recentPayroll[0] || { total_payroll: 0, employee_count: 0, average_salary: 0 };

        // New hires this month
        const [newHires] = await pool.query(`
            SELECT COUNT(*) as count 
            FROM employees 
            WHERE MONTH(hire_date) = MONTH(CURDATE()) 
            AND YEAR(hire_date) = YEAR(CURDATE())
        `);
        stats.newHires = newHires[0]?.count || 0;

        return stats;
    },

    // Get attendance chart data (last 7 days)
    getAttendanceChart: async () => {
        const [data] = await pool.query(`
            SELECT 
                DATE(date) as date,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as on_leave
            FROM attendance 
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND date <= CURDATE()
            GROUP BY DATE(date)
            ORDER BY date DESC
        `);
        return data;
    },

    // Get department distribution
    getDepartmentDistribution: async () => {
        const [data] = await pool.query(`
            SELECT 
                department,
                COUNT(*) as count
            FROM employees
            WHERE status = 'active'
            GROUP BY department
            ORDER BY count DESC
        `);
        return data;
    },

    // Get recent activities (for activity feed)
    getRecentActivities: async (limit = 10) => {
        const [data] = await pool.query(`
            SELECT 
                'attendance' as type,
                CONCAT(e.name, ' marked ', a.status) as description,
                a.created_at as timestamp,
                e.name as employee_name,
                e.avatar_color
            FROM attendance a
            JOIN employees e ON a.employee_id = e.id
            WHERE a.date = CURDATE()
            UNION ALL
            SELECT 
                'leave' as type,
                CONCAT(e.name, ' requested ', l.reason) as description,
                l.created_at as timestamp,
                e.name as employee_name,
                e.avatar_color
            FROM leave_requests l
            JOIN employees e ON l.employee_id = e.id
            WHERE l.status = 'pending'
            UNION ALL
            SELECT 
                'payroll' as type,
                CONCAT('Payroll processed for ', e.name) as description,
                p.processed_date as timestamp,
                e.name as employee_name,
                e.avatar_color
            FROM payroll p
            JOIN employees e ON p.employee_id = e.id
            WHERE p.month = DATE_FORMAT(CURDATE(), '%Y%m')
            ORDER BY timestamp DESC
            LIMIT ?
        `, [limit]);
        return data;
    },

    // Get monthly attendance summary
    getMonthlyAttendance: async (month = null) => {
        const monthCondition = month ? `AND MONTH(date) = ${month}` : '';
        const [data] = await pool.query(`
            SELECT 
                DATE_FORMAT(date, '%Y-%m') as month,
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as on_leave
            FROM attendance
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(date, '%Y-%m')
            ORDER BY month DESC
        `);
        return data;
    }
};

export default DashboardModel;