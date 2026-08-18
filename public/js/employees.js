let allEmployees = [];

// Render Cards to DOM
function renderEmployees(employeesToDisplay) {
    const container = document.getElementById('employee-container');
    if (!container) return;

    container.innerHTML = '';

    if (!Array.isArray(employeesToDisplay) || employeesToDisplay.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">No matching employees found.</p>`;
        return;
    }

    employeesToDisplay.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        
        // Mapped to MySQL column: 'name'
        const empName = emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Employee';
        const formattedId = `#${String(emp.employee_id || 0).padStart(2, '0')}`;
        const departmentTag = emp.department_name || emp.department || (emp.department_id ? `Dept ${emp.department_id}` : '');
        
        // Mapped to MySQL column: 'contact'
        const email = emp.contact || emp.email;
        const emailText = (email && email !== 'N/A') ? `✉️ ${email}` : '';

        card.innerHTML = `
            <div class="card-main">
                <div class="card-top">
                    <h3 class="emp-name">${empName}</h3>
                    <span class="emp-id-tag">${formattedId}</span>
                </div>
                ${emp.position ? `<p class="emp-position">${emp.position}</p>` : ''}
                ${departmentTag ? `<span class="dept-badge">${departmentTag}</span>` : ''}
                ${emailText ? `<p class="emp-email">${emailText}</p>` : ''}
            </div>

            <div class="card-footer">
                <div class="card-actions">
                    <button class="btn-action" onclick="viewDetails(${emp.employee_id})">🔍 Details</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Fetch employees from Backend API
async function loadEmployees() {
    const container = document.getElementById('employee-container');
    try {
        const response = await fetch('/api/employees');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        allEmployees = await response.json();
        renderEmployees(allEmployees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        if (container) {
            container.innerHTML = `<p style="color: var(--accent-pink); grid-column: 1/-1;">Failed to connect to backend server. Make sure node server.js is running.</p>`;
        }
    }
}

// Event Listeners on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();

    // Live Search Bar
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderEmployees(allEmployees);
                return;
            }

            const filtered = allEmployees.filter(emp => {
                const fullName = (emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`).toLowerCase();
                const position = (emp.position || '').toLowerCase();
                const email = (emp.contact || emp.email || '').toLowerCase();
                const dept = String(emp.department_name || emp.department || emp.department_id || '').toLowerCase();

                return fullName.includes(query) || position.includes(query) || email.includes(query) || dept.includes(query);
            });

            renderEmployees(filtered);
        });
    }

    // Modal controls
    const modal = document.getElementById('employee-modal');
    const form = document.getElementById('employee-form');
    const openAddBtn = document.getElementById('open-add-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (openAddBtn) {
        openAddBtn.addEventListener('click', () => {
            if (form) form.reset();
            const title = document.getElementById('modal-title');
            if (title) title.innerText = 'Add New Employee';
            if (modal) modal.style.display = 'flex';
        });
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
        if (form) form.reset();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Form Submit (Add New Employee)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('first-name')?.value.trim() || '';
            const lastName = document.getElementById('last-name')?.value.trim() || '';
            const fullName = `${firstName} ${lastName}`.trim();

            const email = document.getElementById('emp-email')?.value.trim() || '';
            const position = document.getElementById('emp-position')?.value.trim() || 'General';
            const deptId = parseInt(document.getElementById('emp-department')?.value) || 1;
            const salary = parseFloat(document.getElementById('emp-salary')?.value) || 0;
            const hireDate = document.getElementById('hire-date')?.value || '';

            // Map directly to MySQL columns: name, position, department_id, salary, employment_history, contact
            const payload = {
                name: fullName,
                position: position,
                department_id: deptId,
                salary: salary,
                employment_history: hireDate ? `Joined in ${hireDate.substring(0, 4)}` : 'Joined recently',
                contact: email
            };

            try {
                const response = await fetch('/api/employees', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    closeModal();
                    loadEmployees(); // Refresh list to display employee #11 / #12
                } else {
                    const errData = await response.json();
                    alert(`Database Error: ${errData.error || 'Could not save employee.'}`);
                }
            } catch (err) {
                console.error('Submit Error:', err);
                alert('Connection error. Is your Node server running?');
            }
        });
    }

    // Close details modal
    const closeDetailsBtn = document.getElementById('close-details-btn');
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', () => {
            const detailsModal = document.getElementById('details-modal');
            if (detailsModal) detailsModal.style.display = 'none';
        });
    }
});

// View Details Modal
async function viewDetails(id) {
    try {
        const res = await fetch(`/api/employees/${id}`);
        const emp = await res.json();
        
        const empName = emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Employee';
        const email = emp.contact || emp.email || 'N/A';
        const history = emp.employment_history || emp.hire_date || 'N/A';
        const formattedSalary = `R${Number(emp.salary || 0).toLocaleString()}`;

        const detailsBody = document.getElementById('details-body');
        if (detailsBody) {
            detailsBody.innerHTML = `
                <p><strong>ID:</strong> #${emp.employee_id}</p>
                <p><strong>Full Name:</strong> ${empName}</p>
                <p><strong>Position:</strong> ${emp.position || 'N/A'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Department ID:</strong> ${emp.department_id || 1}</p>
                <p><strong>Salary:</strong> ${formattedSalary}</p>
                <p><strong>Employment History:</strong> ${history}</p>
            `;
        }
        
        const detailsModal = document.getElementById('details-modal');
        if (detailsModal) detailsModal.style.display = 'flex';
    } catch (err) {
        console.error('View Details Error:', err);
    }
}