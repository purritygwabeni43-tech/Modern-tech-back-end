import express from "express";

import {
    getPayroll,
    getSinglePayroll,
    getEmployeePayroll,
    addPayroll,
    editPayroll,
    removePayroll
} from "../controllers/payrollController.js";

const router = express.Router();


// GET all payroll
router.get("/", getPayroll);


// GET payroll for a specific employee
router.get("/employee/:employee_id", getEmployeePayroll);


// GET one payroll record
router.get("/:id", getSinglePayroll);


// POST new payroll record
router.post("/", addPayroll);


// UPDATE payroll record
router.put("/:id", editPayroll);


// DELETE payroll record
router.delete("/:id", removePayroll);


export default router;