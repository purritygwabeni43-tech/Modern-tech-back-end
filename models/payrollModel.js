import pool from "../config/db.js";

// Get all payroll records
export const getAllPayroll = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM payroll"
    );

    return rows;
};


// Get one payroll record by payroll ID
export const getPayrollById = async (payroll_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM payroll WHERE payroll_id = ?",
        [payroll_id]
    );

    return rows;
};


// Get payroll records for a specific employee
export const getPayrollByEmployeeId = async (employee_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM payroll WHERE employee_id = ?",
        [employee_id]
    );

    return rows;
};


// Add a payroll record
// Add a payroll record
export const createPayroll = async (
    employee_id,
    hours_worked,
    leave_deductions,
    final_salary
) => {

    // Check if employee exists
    const [employee] = await pool.query(
        `SELECT employee_id
         FROM employees
         WHERE employee_id = ?`,
        [employee_id]
    );

    if (employee.length === 0) {
        const error = new Error(
            "Employee does not exist."
        );

        error.code = "EMPLOYEE_NOT_FOUND";

        throw error;
    }


    // Check if this employee already has payroll
    const [existingPayroll] = await pool.query(
        `SELECT payroll_id
         FROM payroll
         WHERE employee_id = ?`,
        [employee_id]
    );

    if (existingPayroll.length > 0) {
        const error = new Error(
            "This employee already has a payroll record."
        );

        error.code = "DUPLICATE_EMPLOYEE_PAYROLL";

        throw error;
    }


    // Create payroll
    const [result] = await pool.query(
        `INSERT INTO payroll
        (employee_id, hours_worked, leave_deductions, final_salary)
        VALUES (?, ?, ?, ?)`,
        [
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        ]
    );

    return result;
};


// Update a payroll record
export const updatePayroll = async (
    payroll_id,
    employee_id,
    hours_worked,
    leave_deductions,
    final_salary
) => {
    const [result] = await pool.query(
        `UPDATE payroll
         SET employee_id = ?,
             hours_worked = ?,
             leave_deductions = ?,
             final_salary = ?
         WHERE payroll_id = ?`,
        [
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary,
            payroll_id
        ]
    );

    return result;
};


// Delete a payroll record
export const deletePayroll = async (payroll_id) => {
    const [result] = await pool.query(
        "DELETE FROM payroll WHERE payroll_id = ?",
        [payroll_id]
    );

    return result;
};

