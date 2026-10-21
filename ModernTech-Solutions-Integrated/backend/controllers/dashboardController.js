
import { summary } from '../models/dashboardModel.js';

async function dashboard(req, res, next) {
	try {
		const data = await summary();
		res.json({ success: true, data: {
			companyHealth: { attendance: data.attendance.total ? (Number(data.attendance.present) / Number(data.attendance.total)) * 100 : 0, pulseScore: Number(data.reviews.averageScore), totalEmployees: data.employees.totalEmployees },
			employeeStats: { totalEmployees: data.employees.totalEmployees, avgReviewScore: Number(data.reviews.averageScore), averageSalary: Number(data.employees.averageSalary) },
			openTasks: { total: data.leave.pending, needAction: data.leave.pending },
			payroll: { totalPayroll: Number(data.payroll.totalPayroll), totalLeaveDeductions: Number(data.payroll.totalLeaveDeductions) },
			attendance: data.attendance, leave: data.leave, reviews: data.reviews, departmentPerformance: data.departmentPerformance, recentFeedback: data.recentFeedback, recentEmployees: data.recentEmployees, recentPayroll: data.recentPayroll
		}});
	} catch (error) { next(error); }
}

export { dashboard };

