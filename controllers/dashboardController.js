const DashboardModel = require('../models/dashboardModel');
const EmployeeModel = require('../models/employeeModel');
const AttendanceModel = require('../models/attendanceModel');
const PayrollModel = require('../models/payrollModel');

class DashboardController {
    // Get complete dashboard data
    static async getDashboard(req, res) {
        try {
            const dashboardData = await DashboardModel.getDashboardData();
            
            res.status(200).json({
                success: true,
                data: dashboardData
            });
        } catch (error) {
            console.error('Dashboard controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard data',
                error: error.message
            });
        }
    }

    // Get company health metrics
    static async getCompanyHealth(req, res) {
        try {
            const data = await DashboardModel.getCompanyHealth();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching company health',
                error: error.message
            });
        }
    }

    // Get department performance
    static async getDepartmentPerformance(req, res) {
        try {
            const data = await DashboardModel.getDepartmentPerformance();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching department performance',
                error: error.message
            });
        }
    }

    // Get recent feedback
    static async getRecentFeedback(req, res) {
        try {
            const data = await DashboardModel.getRecentFeedback();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching recent feedback',
                error: error.message
            });
        }
    }

    // Get payroll summary
    static async getPayrollSummary(req, res) {
        try {
            const data = await DashboardModel.getPayrollData();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching payroll data',
                error: error.message
            });
        }
    }

    // Get attendance summary
    static async getAttendanceSummary(req, res) {
        try {
            const data = await DashboardModel.getAttendanceSummary();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance summary',
                error: error.message
            });
        }
    }

    // Get all employees
    static async getAllEmployees(req, res) {
        try {
            const data = await EmployeeModel.getAllEmployees();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching employees',
                error: error.message
            });
        }
    }

    // Get employee by ID with stats
    static async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            const data = await EmployeeModel.getEmployeeWithStats(id);
            
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching employee',
                error: error.message
            });
        }
    }
}

module.exports = DashboardController;