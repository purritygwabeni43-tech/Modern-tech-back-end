
import * as Payroll from '../models/payrollModel.js';
function valid(d){return d.employee_id!==undefined&&d.hours_worked!==undefined&&d.leave_deductions!==undefined&&d.final_salary===undefined}
async function all(req,res,next){try{res.json(await Payroll.all())}catch(e){next(e)}}
async function one(req,res,next){try{const r=await Payroll.byId(req.params.id);if(!r)return res.status(404).json({message:'Payroll record not found'});res.json(r)}catch(e){next(e)}}
async function employee(req,res,next){try{const r=await Payroll.byEmployee(req.params.employee_id);res.json(r)}catch(e){next(e)}}
async function eligibleEmployees(req,res,next){try{res.json(await Payroll.eligibleEmployees())}catch(e){next(e)}}
async function create(req,res,next){try{if(!valid(req.body))return res.status(400).json({message:'All payroll fields are required.'});const id=await Payroll.create(req.body);res.status(201).json({message:'Payroll created successfully.',payroll_id:id})}catch(e){next(e)}}
async function update(req,res,next){try{if(!valid(req.body))return res.status(400).json({message:'All payroll fields are required.'});const r=await Payroll.update(req.params.id,req.body);if(!r.affectedRows)return res.status(404).json({message:'Payroll record not found'});res.json({message:'Payroll record updated successfully'})}catch(e){next(e)}}
async function remove(req,res,next){try{const r=await Payroll.remove(req.params.id);if(!r.affectedRows)return res.status(404).json({message:'Payroll record not found'});res.json({message:'Payroll record deleted successfully'})}catch(e){next(e)}}
export {all,one,employee,eligibleEmployees,create,update,remove};

