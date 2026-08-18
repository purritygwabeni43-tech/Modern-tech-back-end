const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Require DB pool to run initial connection check
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

// Default Route
app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    // Make sure SELECT * is used, or explicitly list email, phone, and hire_date
    const query = 'SELECT * FROM employees WHERE employee_id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Employee not found' });
        res.json(results[0]);
    });
});

app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM employees WHERE employee_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Delete Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});

app.post('/api/employees', (req, res) => {
    const { name, position, department_id, salary, employment_history, contact } = req.body;

    // 1. Find highest employee_id currently in database
    db.query('SELECT MAX(employee_id) AS maxId FROM employees', (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }

        // 2. Add 1 to the highest ID found (e.g., 11 + 1 = 12)
        const highestId = results[0].maxId;
        const nextId = (highestId !== null && highestId !== undefined) ? highestId + 1 : 1;

        // 3. Insert the new employee using that new ID
        const insertQuery = `
            INSERT INTO employees (employee_id, name, position, department_id, salary, employment_history, contact) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [nextId, name, position, department_id, salary, employment_history, contact], (insertErr, result) => {
            if (insertErr) {
                console.error('Insert Error:', insertErr);
                return res.status(500).json({ error: insertErr.message });
            }
            res.status(201).json({ message: 'Employee added successfully', employee_id: nextId });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});