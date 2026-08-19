document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();

    // Event Listeners
    document.getElementById('open-add-modal-btn').addEventListener('click', () => openModal());
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('close-details-btn').addEventListener('click', closeDetailsModal);
    document.getElementById('employee-form').addEventListener('submit', handleFormSubmit);

    // Live Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        fetchEmployees(e.target.value);
    });

    // Close Modals on Overlay Click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
            closeDetailsModal();
        }
    });
});

let allEmployees = [];

// READ & SEARCH: Fetch employees from Express backend
async function fetchEmployees(searchQuery = '') {
    try {
        const response = await fetch(`http://localhost:3000/api/employees?search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (!response.ok) {
            console.error('Server error:', data.error);
            document.getElementById('employee-container').innerHTML = 
                `<p style="color: #ef4444; grid-column: 1/-1;">Database Error: ${data.error}</p>`;
            return;
        }

        allEmployees = data;
        renderEmployees(allEmployees);
    } catch (err) {
        console.error('Failed to load employees:', err);
    }
}

// RENDER: Render database cards in grid (salary & history hidden)
function renderEmployees(employees) {
    const container = document.getElementById('employee-container');
    container.innerHTML = '';

    if (!Array.isArray(employees) || employees.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8; grid-column: 1/-1;">No matching employees found.</p>`;
        return;
    }

    employees.forEach((emp, index) => {
        const card = document.createElement('div');
        card.className = 'employee-card';

        const idTag = `#${String(index + 1).padStart(2, '0')}`;
        // Displays department name or falls back to Dept ID
        const deptLabel = emp.department || `Dept ${emp.department_id}`;

        card.innerHTML = `
            <div>
                <div class="card-top-header">
                    <h3 class="emp-name">${emp.name}</h3>
                    <span class="emp-id-tag">${idTag}</span>
                </div>
                <p class="emp-position">${emp.position}</p>
                <div class="dept-badge">${deptLabel}</div>

                <div class="emp-email-row">
                    ✉️ <span>${emp.contact}</span>
                </div>
            </div>

            <div class="card-actions">
                <button type="button" class="btn-action btn-details" onclick="viewDetails(${emp.employee_id})">🔍 Details</button>
                <button type="button" class="btn-action btn-edit" onclick="editEmployee(${emp.employee_id})">✏️ Edit</button>
                <button type="button" class="btn-action btn-delete" onclick="deleteEmployee(${emp.employee_id})">🗑️ Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// DETAILS: View Employee Modal (Shows Department Name + ID, Salary & Employment History)
async function viewDetails(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/employees/${id}`);
        const emp = await res.json();

        if (!res.ok) {
            alert(`Error: ${emp.error || 'Failed to fetch details'}`);
            return;
        }

        const deptDisplay = emp.department 
            ? `${emp.department} (Dept ${emp.department_id})` 
            : `Dept ${emp.department_id}`;

        const detailsBody = document.getElementById('details-body');
        detailsBody.innerHTML = `
            <p><strong>Employee ID:</strong> #${emp.employee_id}</p>
            <p><strong>Name:</strong> ${emp.name}</p>
            <p><strong>Position:</strong> ${emp.position}</p>
            <p><strong>Department:</strong> ${deptDisplay}</p>
            <p><strong>Salary:</strong> R${Number(emp.salary || 0).toLocaleString()}</p>
            <p><strong>Employment History:</strong> ${emp.employment_history || 'N/A'}</p>
            <p><strong>Contact Email:</strong> ${emp.contact}</p>
        `;

        document.getElementById('details-modal').style.display = 'flex';
    } catch (err) {
        console.error('Error fetching details:', err);
        alert('Could not retrieve employee details.');
    }
}

// EDIT: Populate Form
async function editEmployee(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/employees/${id}`);
        const emp = await res.json();

        if (!res.ok) {
            alert(`Error: ${emp.error || 'Failed to fetch employee'}`);
            return;
        }

        document.getElementById('emp-id').value = emp.employee_id;
        document.getElementById('emp-name').value = emp.name;
        document.getElementById('emp-position').value = emp.position;
        document.getElementById('emp-department').value = emp.department_id;
        document.getElementById('emp-salary').value = emp.salary;
        document.getElementById('emp-history').value = emp.employment_history;
        document.getElementById('emp-contact').value = emp.contact;

        openModal(true);
    } catch (err) {
        console.error('Error loading employee for edit:', err);
    }
}

// CREATE / UPDATE Form Handler
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('emp-id').value;
    const employeeData = {
        name: document.getElementById('emp-name').value,
        position: document.getElementById('emp-position').value,
        department_id: document.getElementById('emp-department').value,
        salary: document.getElementById('emp-salary').value,
        employment_history: document.getElementById('emp-history').value,
        contact: document.getElementById('emp-contact').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:3000/api/employees/${id}` : 'http://localhost:3000/api/employees';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message); // Shows "Employee added successfully" or "Employee updated successfully"
            closeModal();
            fetchEmployees();
        } else {
            alert(`Failed to save: ${data.error || 'Server error'}`);
        }
    } catch (err) {
        console.error('Error saving employee:', err);
        alert('Could not save employee. Check server connection.');
    }
}

// DELETE: Delete Employee
async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
        const res = await fetch(`http://localhost:3000/api/employees/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            alert(data.message); // Shows "Employee deleted successfully"
            fetchEmployees();
        } else {
            alert(`Failed to delete employee: ${data.error || 'Server error'}`);
        }
    } catch (err) {
        console.error('Error deleting employee:', err);
        alert('Could not reach the server. Please try again.');
    }
}

function openModal(isEdit = false) {
    document.getElementById('modal-title').innerText = isEdit ? 'Edit Employee' : 'Add New Employee';
    if (!isEdit) document.getElementById('employee-form').reset();
    document.getElementById('employee-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('employee-modal').style.display = 'none';
    document.getElementById('employee-form').reset();
    document.getElementById('emp-id').value = '';
}

function closeDetailsModal() {
    document.getElementById('details-modal').style.display = 'none';
}