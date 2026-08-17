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
export const createPayroll = async (
    employee_id,
    hours_worked,
    leave_deductions,
    final_salary
) => {
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