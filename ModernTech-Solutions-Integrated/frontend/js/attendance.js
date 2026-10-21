
let attendanceRecords = [];
let employees = [];
let editingId = null;
const body = document.getElementById('attendanceBody');
const search = document.getElementById('attendanceSearch');
const statusFilter = document.getElementById('attendanceStatus');
const modal = document.getElementById('attendanceModal');
const form = document.getElementById('attendanceForm');
const employeeSelect = document.getElementById('attendanceEmployee');

function formatDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char])); }
function render() {
  const query = (search.value || '').toLowerCase();
  const selectedStatus = statusFilter.value;
  const filtered = attendanceRecords.filter((record) => (`${record.name} ${record.position} ${record.status}`).toLowerCase().includes(query) && (selectedStatus === 'all' || record.status === selectedStatus));
  body.innerHTML = filtered.length ? filtered.map((record) => `<tr><td><div class="employee-cell"><div class="employee-avatar blue-avatar">${escapeHtml(String(record.name || '').split(/\s+/).map((part) => part[0]).join('').slice(0, 2))}</div><div><strong>${escapeHtml(record.name)}</strong><small>#${record.employee_id}</small></div></div></td><td>${escapeHtml(record.position)}</td><td>${formatDate(record.attendance_date)}</td><td><span class="status ${String(record.status).toLowerCase()}">${escapeHtml(record.status)}</span></td><td class="action-cell"><button type="button" class="table-action edit-attendance" data-id="${record.attendance_id}"><i class="fa-solid fa-pen"></i> Edit</button><button type="button" class="table-action delete-attendance" data-id="${record.attendance_id}"><i class="fa-solid fa-trash"></i> Delete</button></td></tr>`).join('') : '<tr><td colspan="5">No attendance records found.</td></tr>';
  document.getElementById('attendanceResultCount').textContent = `Showing ${filtered.length} record${filtered.length === 1 ? '' : 's'}`;
  document.getElementById('presentCount').textContent = filtered.filter((record) => record.status === 'Present').length;
  document.getElementById('lateCount').textContent = filtered.filter((record) => record.status === 'Late').length;
  document.getElementById('absentCount').textContent = filtered.filter((record) => record.status === 'Absent').length;
  document.querySelectorAll('.edit-attendance').forEach((button) => button.addEventListener('click', () => openForm(Number(button.dataset.id))));
  document.querySelectorAll('.delete-attendance').forEach((button) => button.addEventListener('click', () => deleteRecord(Number(button.dataset.id))));
}
async function loadEmployees() { const response = await fetch('/employees'); if (!response.ok) throw new Error('Failed to load employees'); employees = await response.json(); employeeSelect.innerHTML = employees.map((employee) => `<option value="${employee.employee_id}">${escapeHtml(employee.name)} (#${employee.employee_id})</option>`).join(''); }
async function load() { try { const response = await fetch('/attendance'); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Failed to load attendance'); attendanceRecords = data; render(); } catch (error) { body.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`; } }
function openForm(id = null) { editingId = id; const record = attendanceRecords.find((item) => item.attendance_id === id); document.getElementById('attendanceModalTitle').textContent = id ? 'Edit Attendance' : 'Add Attendance'; employeeSelect.value = record?.employee_id || employees[0]?.employee_id || ''; document.getElementById('attendanceDate').value = record ? formatDate(record.attendance_date) : formatDate(new Date()); document.getElementById('attendanceRecordStatus').value = record?.status || 'Present'; modal.hidden = false; }
function closeForm() { modal.hidden = true; editingId = null; }
async function save(event) { event.preventDefault(); const payload = { employee_id: Number(employeeSelect.value), attendance_date: document.getElementById('attendanceDate').value, status: document.getElementById('attendanceRecordStatus').value }; try { const response = await fetch(editingId ? `/attendance/${editingId}` : '/attendance', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to save attendance'); closeForm(); await load(); } catch (error) { alert(error.message); } }
async function deleteRecord(id) { if (!confirm('Delete this attendance record?')) return; const response = await fetch(`/attendance/${id}`, { method: 'DELETE' }); const data = await response.json(); if (!response.ok) return alert(data.message || 'Unable to delete attendance'); await load(); }
search.addEventListener('input', render); statusFilter.addEventListener('change', render); form.addEventListener('submit', save); document.getElementById('attendanceAddButton').addEventListener('click', () => openForm()); document.getElementById('attendanceCancelButton').addEventListener('click', closeForm); modal.addEventListener('click', (event) => { if (event.target === modal) closeForm(); });
(async function init() { try { await loadEmployees(); await load(); } catch (error) { body.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`; } }());

