const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "modern_tech"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
        return;
    }

    console.log("Connected to modern_tech database!");
});
app.get("/attendance", (req, res) => {
    const sql = `
        SELECT 
            attendance.attendance_id,
            attendance.employee_id,
            employees.name,
            employees.position,
            attendance.attendance_date,
            attendance.status
        FROM attendance
        JOIN employees
            ON attendance.employee_id = employees.employee_id
        ORDER BY attendance.attendance_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Attendance error:", err);
            return res.status(500).json({
                error: "Failed to fetch attendance data"
            });
        }

        res.json(results);
    });
});
app.get("/attendance/:employeeId", (req, res) => {
    const employeeId = req.params.employeeId;

    const sql = `
        SELECT
            attendance.attendance_id,
            attendance.employee_id,
            employees.name,
            employees.position,
            attendance.attendance_date,
            attendance.status
        FROM attendance
        JOIN employees
            ON attendance.employee_id = employees.employee_id
        WHERE attendance.employee_id = ?
        ORDER BY attendance.attendance_date DESC
    `;

    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error("Employee attendance error:", err);
            return res.status(500).json({
                error: "Failed to fetch employee attendance"
            });
        }

        res.json(results);
    });
});

app.get("/leave-requests", (req, res) => {
    const sql = `
        SELECT
            leave_requests.leave_id,
            leave_requests.employee_id,
            employees.name,
            employees.position,
            leave_requests.leave_date,
            leave_requests.reason,
            leave_requests.status
        FROM leave_requests
        JOIN employees
            ON leave_requests.employee_id = employees.employee_id
        ORDER BY leave_requests.leave_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Leave requests error:", err);
            return res.status(500).json({
                error: "Failed to fetch leave requests"
            });
        }

        res.json(results);
    });
});

app.get("/leave-requests/:employeeId", (req, res) => {
    const employeeId = req.params.employeeId;

    const sql = `
        SELECT 
            leave_requests.leave_id,
            leave_requests.employee_id,
            employees.name,
            employees.position,
            leave_requests.leave_date,
            leave_requests.reason,
            leave_requests.status
        FROM leave_requests
        JOIN employees
            ON leave_requests.employee_id = employees.employee_id
        WHERE leave_requests.employee_id = ?
        ORDER BY leave_requests.leave_date DESC
    `;

    db.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error("Employee leave request error:", err);
            return res.status(500).json({
                error: "Failed to fetch employee leave requests"
            });
        }

        res.json(results);
    });
});

app.get("/employees", (req, res) => {
    const sql = "SELECT * FROM employees";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Employees error:", err);
            return res.status(500).json({
                error: "Failed to fetch employees"
            });
        }

        res.json(results);
    });
});
app.post("/leave-requests", (req, res) => {
    const { employee_id, leave_date, reason } = req.body;

    const status = "Pending";

    const sql = `
        INSERT INTO leave_requests
        (employee_id, leave_date, reason, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [employee_id, leave_date, reason, status],
        (err, result) => {

            if (err) {
                console.error("Create leave request error:", err);

                return res.status(500).json({
                    error: "Failed to create leave request"
                });
            }

            res.status(201).json({
                message: "Leave request created successfully",
                leave_id: result.insertId
            });
        }
    );
});
app.put("/leave-requests/:leaveId/status", (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["Approved", "Denied"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            error: "Status must be Approved or Denied"
        });
    }

    const sql = "UPDATE leave_requests SET status = ? WHERE leave_id = ?";

    db.query(sql, [status, leaveId], (err, result) => {
        if (err) {
            console.error("Update leave request error:", err);
            return res.status(500).json({
                error: "Failed to update leave request"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Leave request not found" });
        }

        res.json({ message: "Leave request updated successfully" });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
