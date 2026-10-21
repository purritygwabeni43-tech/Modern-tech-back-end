
import jwt from 'jsonwebtoken';
function authenticateToken(req,res,next){
  const header=req.headers.authorization; const token=header&&header.split(' ')[1];
  if(!token) return res.status(401).json({success:false,message:'Authentication required'});
  try{ req.user=jwt.verify(token,process.env.JWT_SECRET); next(); }
  catch(e){ return res.status(403).json({success:false,message:'Invalid or expired token'}); }
}
function requireRole(...roles){
  const allowed=roles.flat().map(r=>String(r).toUpperCase());
  return (req,res,next)=> allowed.includes(String(req.user?.role||'').toUpperCase()) ? next() : res.status(403).json({success:false,message:'Insufficient permissions'});
}
export { authenticateToken, requireRole };

