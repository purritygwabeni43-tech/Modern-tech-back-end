
import jwt from 'jsonwebtoken';
import * as User from '../models/userModel.js';
function tokenFor(user) { return jwt.sign({ user_id: user.id, employee_id: user.employee_id, email: user.email, username: user.username, role: user.role_name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }) }
async function login(req, res, next) {
  try {
    const identifier = (req.body.username || req.body.email || '').trim(); const password = String(req.body.password || '');
    if (!identifier || !password) return res.status(400).json({ message: 'Username/email and password are required.' });
    const user = await User.findByIdentifier(identifier);
    if (!user || !user.is_active || !(await User.verifyPassword(password, user))) return res.status(401).json({ message: 'Invalid username or password.' });
    res.json({ message: 'Login successful.', token: tokenFor(user), user: { user_id: user.id, id: user.id, employee_id: user.employee_id, username: user.username, full_name: user.full_name, email: user.email, role: user.role_name, position: user.position || null, department: user.department_name || null } });
  } catch (e) { next(e) }
}
async function me(req, res, next) { try { const user = await User.findById(req.user.user_id); if (!user) return res.status(404).json({ message: 'User not found' }); delete user.password_hash; res.json({ success: true, user }); } catch (e) { next(e) } }
async function users(req, res, next) { try { res.json(await User.list()) } catch (e) { next(e) } }
async function register(req, res, next) {
  try { const { full_name, email, password } = req.body; if (!full_name || !email || !password) return res.status(400).json({ message: 'full_name, email and password are required' }); if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' }); const user = await User.create(req.body); delete user.password_hash; res.status(201).json({ message: 'User registered successfully', user }) } catch (e) { if (e.code === 'ER_DUP_ENTRY') { e.status = 409; e.message = 'Email or username already exists' } next(e) }
}
async function changePassword(req, res, next) {
  try { const { current_password, new_password } = req.body; if (!current_password || !new_password) return res.status(400).json({ message: 'Current and new password are required' }); if (new_password.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' }); const user = await User.findById(req.user.user_id); if (!user || !(await User.verifyPassword(current_password, user))) return res.status(401).json({ message: 'Current password is incorrect' }); await User.changePassword(user.id, new_password); res.json({ message: 'Password updated successfully' }) } catch (e) { next(e) }
}
async function updateRole(req, res, next) { try { const role = req.body.role_id ?? req.body.role; const r = await User.updateRole(req.params.id, role); if (!r.affectedRows) return res.status(404).json({ message: 'User not found' }); res.json({ message: 'User role updated successfully' }) } catch (e) { next(e) } }
async function removeUser(req, res, next) { try { if (Number(req.params.id) === Number(req.user.user_id)) return res.status(400).json({ message: 'You cannot delete your own account' }); const r = await User.remove(req.params.id); if (!r.affectedRows) return res.status(404).json({ message: 'User not found' }); res.json({ message: 'User deleted successfully' }) } catch (e) { next(e) } }
function logout(req, res) { res.json({ message: 'Logout successful. Remove the local token.' }) }
export { login, me, users, register, changePassword, updateRole, removeUser, logout };

