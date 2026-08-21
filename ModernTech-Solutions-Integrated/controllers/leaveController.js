
import * as Leave from '../models/leaveModel.js';

const statuses = ['Pending', 'Approved', 'Denied'];
function valid(body) { return body.employee_id && body.leave_date && body.reason; }
async function all(req, res, next) { try { res.json(await Leave.all(req.query.employee_id)); } catch (error) { next(error); } }
async function one(req, res, next) { try { const record = await Leave.byId(req.params.id); if (!record) return res.status(404).json({ message: 'Leave request not found.' }); res.json(record); } catch (error) { next(error); } }
async function create(req, res, next) { try { if (!valid(req.body)) return res.status(400).json({ message: 'employee_id, leave_date and reason are required.' }); const id = await Leave.create(req.body); res.status(201).json({ message: 'Leave request created successfully.', leave_id: id }); } catch (error) { next(error); } }
async function update(req, res, next) { try { if (!valid(req.body) || (req.body.status && !statuses.includes(req.body.status))) return res.status(400).json({ message: 'Valid employee, date, reason and status are required.' }); const result = await Leave.update(req.params.id, req.body); if (!result.affectedRows) return res.status(404).json({ message: 'Leave request not found.' }); res.json({ message: 'Leave request updated successfully.' }); } catch (error) { next(error); } }
async function remove(req, res, next) { try { const result = await Leave.remove(req.params.id); if (!result.affectedRows) return res.status(404).json({ message: 'Leave request not found.' }); res.json({ message: 'Leave request deleted successfully.' }); } catch (error) { next(error); } }
async function status(req, res, next) { try { if (!statuses.includes(req.body.status)) return res.status(400).json({ message: `Status must be one of: ${statuses.join(', ')}` }); const result = await Leave.status(req.params.id, req.body.status); if (!result.affectedRows) return res.status(404).json({ message: 'Leave request not found.' }); res.json({ message: 'Leave status updated successfully.' }); } catch (error) { next(error); } }
export { all, one, create, update, remove, status };

