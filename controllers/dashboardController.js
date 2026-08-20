import DashboardModel from '../models/dashboardModel.js';

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await DashboardModel.getStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

export const getAttendanceChart = async (req, res) => {
    try {
        const data = await DashboardModel.getAttendanceChart();
        
        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Attendance chart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance chart data'
        });
    }
};

export const getDepartmentDistribution = async (req, res) => {
    try {
        const data = await DashboardModel.getDepartmentDistribution();
        
        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Department distribution error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch department distribution'
        });
    }
};

export const getRecentActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await DashboardModel.getRecentActivities(limit);
        
        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Recent activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activities'
        });
    }
};

export const getMonthlyAttendance = async (req, res) => {
    try {
        const month = req.query.month || null;
        const data = await DashboardModel.getMonthlyAttendance(month);
        
        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Monthly attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly attendance'
        });
    }
};

export const getFullDashboard = async (req, res) => {
    try {
        const [stats, attendanceChart, departmentDistribution, recentActivities, monthlyAttendance] = await Promise.all([
            DashboardModel.getStats(),
            DashboardModel.getAttendanceChart(),
            DashboardModel.getDepartmentDistribution(),
            DashboardModel.getRecentActivities(10),
            DashboardModel.getMonthlyAttendance()
        ]);

        res.json({
            success: true,
            data: {
                stats,
                attendanceChart,
                departmentDistribution,
                recentActivities,
                monthlyAttendance
            }
        });
    } catch (error) {
        console.error('Full dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch full dashboard data'
        });
    }
};