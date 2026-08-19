const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'modern_tech'
});

// GET all employees + Search support + Department Name
app.get('/api/employees', (req, res) => {
    const search = req.query.search || '';
    const query = `
        SELECT e.*, d.department_name AS department 
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.department_id
        WHERE e.name LIKE ? OR e.position LIKE ? OR e.contact LIKE ? OR d.department_name LIKE ?
    `;
    const searchPattern = `%${search}%`;
    db.query(query, [searchPattern, searchPattern, searchPattern, searchPattern], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single employee details + Department Name
app.get('/api/employees/:id', (req, res) => {
    const query = `
        SELECT e.*, d.department_name AS department 
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.department_id
        WHERE e.employee_id = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Employee not found' });
        res.json(results[0]);
    });
});

// POST add new employee
app.post('/api/employees', (req, res) => {
    const { name, position, department_id, salary, employment_history, contact } = req.body;
    const query = `
        INSERT INTO employees (name, position, department_id, salary, employment_history, contact)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, position, department_id, salary, employment_history, contact], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
    });
});

// PUT update employee
app.put('/api/employees/:id', (req, res) => {
    const { name, position, department_id, salary, employment_history, contact } = req.body;
    const query = `
        UPDATE employees 
        SET name = ?, position = ?, department_id = ?, salary = ?, employment_history = ?, contact = ?
        WHERE employee_id = ?
    `;
    db.query(query, [name, position, department_id, salary, employment_history, contact, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Employee updated successfully' });
    });
});

// DELETE employee bypassing child foreign key blockers
app.delete('/api/employees/:id', (req, res) => {
    const empId = req.params.id;

    db.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('DELETE FROM employees WHERE employee_id = ?', [empId], (err) => {
            db.query('SET FOREIGN_KEY_CHECKS = 1');

            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Employee deleted successfully' });
        });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});