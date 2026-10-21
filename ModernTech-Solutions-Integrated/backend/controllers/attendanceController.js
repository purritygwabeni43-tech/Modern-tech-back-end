
import * as Attendance from '../models/attendanceModel.js';

const required = ['employee_id', 'attendance_date', 'status'];
function valid(body) { return required.every((field) => body[field] !== undefined && body[field] !== ''); }
async function all(req, res, next) { try { res.json(await Attendance.all(req.query.employee_id)); } catch (error) { next(error); } }
async function one(req, res, next) { try { const record = await Attendance.byId(req.params.id); if (!record) return res.status(404).json({ message: 'Attendance record not found.' }); res.json(record); } catch (error) { next(error); } }
async function create(req, res, next) { try { if (!valid(req.body)) return res.status(400).json({ message: 'employee_id, attendance_date and status are required.' }); const id = await Attendance.create(req.body); res.status(201).json({ message: 'Attendance created successfully.', attendance_id: id }); } catch (error) { next(error); } }
async function update(req, res, next) { try { if (!valid(req.body)) return res.status(400).json({ message: 'employee_id, attendance_date and status are required.' }); const result = await Attendance.update(req.params.id, req.body); if (!result.affectedRows) return res.status(404).json({ message: 'Attendance record not found.' }); res.json({ message: 'Attendance updated successfully.' }); } catch (error) { next(error); } }
async function remove(req, res, next) { try { const result = await Attendance.remove(req.params.id); if (!result.affectedRows) return res.status(404).json({ message: 'Attendance record not found.' }); res.json({ message: 'Attendance deleted successfully.' }); } catch (error) { next(error); } }
export { all, one, create, update, remove };

