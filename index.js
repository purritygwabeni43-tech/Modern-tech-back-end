import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import payrollRoutes from "./routes/payrollRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

// Authentication
app.use("/", authRoutes);

// Payroll
app.use("/payroll", payrollRoutes);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "ModernTech API is running"
    });
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});