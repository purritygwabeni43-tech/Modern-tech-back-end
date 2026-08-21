
import * as Department from '../models/departmentModel.js';
async function all(req,res,next){ try{res.json(await Department.all())}catch(e){next(e)} }
export { all };

