
import * as Performance from '../models/performanceModel.js';
function valid(body) { return body.employee_id && body.review_date && body.score !== undefined && Number(body.score) >= 1 && Number(body.score) <= 5; }
async function all(req, res, next) { try { res.json(await Performance.all()); } catch (error) { next(error); } }
async function one(req, res, next) { try { const review = await Performance.byId(req.params.id); if (!review) return res.status(404).json({ message: 'Performance review not found.' }); res.json(review); } catch (error) { next(error); } }
async function create(req, res, next) { try { if (!valid(req.body)) return res.status(400).json({ message: 'employee_id, review_date and a score from 1 to 5 are required.' }); const reviewId = await Performance.create(req.body); res.status(201).json({ message: 'Performance review created successfully.', review_id: reviewId }); } catch (error) { next(error); } }
async function update(req, res, next) { try { if (!valid(req.body)) return res.status(400).json({ message: 'employee_id, review_date and a score from 1 to 5 are required.' }); const result = await Performance.update(req.params.id, req.body); if (!result.affectedRows) return res.status(404).json({ message: 'Performance review not found.' }); res.json({ message: 'Performance review updated successfully.' }); } catch (error) { next(error); } }
async function remove(req, res, next) { try { const result = await Performance.remove(req.params.id); if (!result.affectedRows) return res.status(404).json({ message: 'Performance review not found.' }); res.json({ message: 'Performance review deleted successfully.' }); } catch (error) { next(error); } }
export { all, one, create, update, remove };

