const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "ModernTech HR API is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;


// ========================================
// TEST API
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "ModernTech HR API is running!"
    });
});


// ========================================
// GET ALL EMPLOYEES
// ========================================

app.get("/api/employees", (req, res) => {

    const sql = "SELECT * FROM employees";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve employees"
            });
        }

        res.status(200).json({
            success: true,
            employees: results
        });
    });
});


// ========================================
// GET ONE EMPLOYEE
// ========================================

app.get("/api/employees/:id", (req, res) => {

    const employeeId = req.params.id;

    const sql = "SELECT * FROM employees WHERE employee_id = ?";

    db.query(sql, [employeeId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            employee: results[0]
        });
    });
});


// ========================================
// CREATE EMPLOYEE
// ========================================

app.post("/api/employees", (req, res) => {

    const {
        first_name,
        last_name,
        email,
        department,
        position,
        salary
    } = req.body;


    // Validation
    if (!first_name || !last_name || !email || !department) {

        return res.status(400).json({
            success: false,
            message: "First name, last name, email and department are required"
        });
    }


    const sql = `
        INSERT INTO employees
        (first_name, last_name, email, department, position, salary)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        first_name,
        last_name,
        email,
        department,
        position,
        salary
    ];


    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to create employee"
            });
        }

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee_id: result.insertId
        });
    });
});


// ========================================
// UPDATE EMPLOYEE
// ========================================

app.put("/api/employees/:id", (req, res) => {

    const employeeId = req.params.id;

    const {
        first_name,
        last_name,
        email,
        department,
        position,
        salary
    } = req.body;


    if (!first_name || !last_name || !email || !department) {

        return res.status(400).json({
            success: false,
            message: "Required employee information is missing"
        });
    }


    const sql = `
        UPDATE employees
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            department = ?,
            position = ?,
            salary = ?
        WHERE employee_id = ?
    `;


    const values = [
        first_name,
        last_name,
        email,
        department,
        position,
        salary,
        employeeId
    ];


    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to update employee"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Employee updated successfully"
        });
    });
});


// ========================================
// DELETE EMPLOYEE
// ========================================

app.delete("/api/employees/:id", (req, res) => {

    const employeeId = req.params.id;

    const sql = "DELETE FROM employees WHERE employee_id = ?";

    db.query(sql, [employeeId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete employee"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    });
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});