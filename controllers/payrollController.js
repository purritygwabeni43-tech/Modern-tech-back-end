import {
    getAllPayroll,
    getPayrollById,
    getPayrollByEmployeeId,
    createPayroll,
    updatePayroll,
    deletePayroll
} from "../models/payrollModel.js";

// GET all payroll records
export const getPayroll = async (req, res) => {
    try {
        const payroll = await getAllPayroll();

        res.status(200).json(payroll);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve payroll records"
        });
    }
};


// GET one payroll record
export const getSinglePayroll = async (req, res) => {
    try {
        const { id } = req.params;

        const payroll = await getPayrollById(id);

        if (payroll.length === 0) {
            return res.status(404).json({
                message: "Payroll record not found"
            });
        }

        res.status(200).json(payroll[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve payroll record"
        });
    }
};


// GET payroll by employee ID
export const getEmployeePayroll = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const payroll = await getPayrollByEmployeeId(employee_id);

        if (payroll.length === 0) {
            return res.status(404).json({
                message: "No payroll records found for this employee"
            });
        }

        res.status(200).json(payroll);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve employee payroll"
        });
    }
};


export const addPayroll = async (req, res) => {
    try {

        const {
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        } = req.body;

        // Validate required fields
        if (
            !employee_id ||
            hours_worked === undefined ||
            leave_deductions === undefined ||
            final_salary === undefined
        ) {
            return res.status(400).json({
                message: "All payroll fields are required."
            });
        }

        // Create payroll
        const result = await createPayroll(
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        );

        return res.status(201).json({
            message: "Payroll created successfully.",
            payroll_id: result.insertId
        });

    } catch (error) {

    if (error.code === "EMPLOYEE_NOT_FOUND") {
        return res.status(404).json({
            message: "Employee does not exist."
        });
    }

    if (error.code === "DUPLICATE_EMPLOYEE_PAYROLL") {
        return res.status(409).json({
            message: "Already exists."
        });
    }

    console.error("Error creating payroll:", error);

    return res.status(500).json({
        message: "Failed to create payroll."
        });
    }
};


// PUT - Update payroll
export const editPayroll = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        } = req.body;


        // Check that all fields were provided
        if (
            employee_id === undefined ||
            hours_worked === undefined ||
            leave_deductions === undefined ||
            final_salary === undefined
        ) {
            return res.status(400).json({
                message: "All payroll fields are required"
            });
        }


        const result = await updatePayroll(
            id,
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Payroll record not found"
            });
        }


        res.status(200).json({
            message: "Payroll record updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update payroll record"
        });
    }
};


// DELETE - Delete payroll
export const removePayroll = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deletePayroll(id);


        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Payroll record not found"
            });
        }


        res.status(200).json({
            message: "Payroll record deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete payroll record"
        });
    }
};