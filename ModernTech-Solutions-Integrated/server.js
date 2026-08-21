
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', async (req, res) => {
	try { await testConnection(); res.json({ success: true, status: 'OK', database: process.env.DB_NAME || 'modern_tech2' }); }
	catch (error) { res.status(503).json({ success: false, status: 'DEGRADED', message: error.message }); }
});
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/leave', leaveRoutes);
app.use('/payroll', payrollRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/departments', departmentRoutes);
app.use('/auth', authRoutes);
app.use('/performance', performanceRoutes);
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint not found.' }));
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
if (process.env.NODE_ENV !== 'test') {
	testConnection().then(() => console.log(`MySQL connected to ${process.env.DB_NAME || 'modern_tech2'}`))
		.catch((error) => console.error('MySQL connection failed:', error.message))
		.finally(() => app.listen(port, () => console.log(`ModernTech running on http://localhost:${port}`)));
}

export default app;

