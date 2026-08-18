const db = require('../config/db');

// 1. Get All Employees (with optional Search)
exports.getAllEmployees = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM employees';
        let params = [];

        // Search feature across name, job title, and email
        if (search) {
            query += ' WHERE first_name LIKE ? OR last_name LIKE ? OR job_title LIKE ? OR email LIKE ?';
            const searchTerm = `%${search}%`;
            params = [searchTerm, searchTerm, searchTerm, searchTerm];
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Employee Details by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM employees WHERE employee_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Add New Employee
exports.addEmployee = async (req, res) => {
    const { first_name, last_name, email, phone_number, job_title, department_id, salary, hire_date, employment_status } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO employees (first_name, last_name, email, phone_number, job_title, department_id, salary, hire_date, employment_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, phone_number, job_title, department_id, salary, hire_date, employment_status || 'Active']
        );
        res.status(201).json({ message: 'Employee added successfully', employee_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Employee
exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, job_title, department_id, salary, hire_date, employment_status } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone_number = ?, job_title = ?, department_id = ?, salary = ?, hire_date = ?, employment_status = ?
             WHERE employee_id = ?`,
            [first_name, last_name, email, phone_number, job_title, department_id, salary, hire_date, employment_status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Delete Employee
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM employees WHERE employee_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add New Employee
exports.addEmployee = async (req, res) => {
    const { name, position, department_id, salary, employment_history } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO employees (name, position, department_id, salary, employment_history)
             VALUES (?, ?, ?, ?, ?)`,
            [name, position, department_id, salary, employment_history]
        );
        res.status(201).json({ message: 'Employee added successfully', employee_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};