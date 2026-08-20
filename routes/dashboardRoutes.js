import express from 'express';
import { 
    getDashboardStats, 
    getAttendanceChart, 
    getDepartmentDistribution,
    getRecentActivities,
    getMonthlyAttendance,
    getFullDashboard
} from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard endpoints
router.get('/stats', getDashboardStats);
router.get('/attendance-chart', getAttendanceChart);
router.get('/department-distribution', getDepartmentDistribution);
router.get('/recent-activities', getRecentActivities);
router.get('/monthly-attendance', getMonthlyAttendance);
router.get('/full', getFullDashboard);

// HR only routes (additional sensitive data)
router.get('/hr/stats', authorize('HR'), getDashboardStats);
router.get('/hr/full', authorize('HR'), getFullDashboard);

export default router;