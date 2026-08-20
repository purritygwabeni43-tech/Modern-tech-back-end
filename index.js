import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Endpoints:`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - GET  /api/auth/profile (requires token)`);
    console.log(`   - GET  /api/dashboard/stats (requires token)`);
    console.log(`   - GET  /api/dashboard/full (requires token)`);
    console.log(`   - GET  /api/health`);
    console.log(`\n🔑 Test credentials:`);
    console.log(`   Email: lungile@moderntech.com`);
    console.log(`   Password: Password124`);
});

export default app;