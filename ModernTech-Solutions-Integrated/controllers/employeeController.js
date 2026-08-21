
import * as Employee from '../models/employeeModel.js';
const required=['name','position','department_id','salary','contact'];
function validate(body){ return required.filter(k=>body[k]===undefined||body[k]===null||String(body[k]).trim()===''); }
async function getAll(req,res,next){try{res.json(await Employee.all(req.query.search||''))}catch(e){next(e)}}
async function getOne(req,res,next){try{const x=await Employee.byId(req.params.id);if(!x)return res.status(404).json({error:'Employee not found'});res.json(x)}catch(e){next(e)}}
async function create(req,res,next){try{const missing=validate(req.body);if(missing.length)return res.status(400).json({error:`Missing fields: ${missing.join(', ')}`});const id=await Employee.create(req.body);res.status(201).json({message:'Employee added successfully',employee_id:id,id})}catch(e){next(e)}}
async function update(req,res,next){try{const missing=validate(req.body);if(missing.length)return res.status(400).json({error:`Missing fields: ${missing.join(', ')}`});const r=await Employee.update(req.params.id,req.body);if(!r.affectedRows)return res.status(404).json({error:'Employee not found'});res.json({message:'Employee updated successfully'})}catch(e){next(e)}}
async function remove(req,res,next){try{const r=await Employee.remove(req.params.id);if(!r.affectedRows)return res.status(404).json({error:'Employee not found'});res.json({message:'Employee deleted successfully'})}catch(e){next(e)}}
export {getAll,getOne,create,update,remove};

