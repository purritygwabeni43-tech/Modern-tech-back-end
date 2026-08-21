
function getLoggedInUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
        return null;
    }
    return user;
}

function getUserRole() {
    const user = getLoggedInUser();
    return user ? String(user.role || "").toUpperCase() : null;
}

function requireRole(allowedRoles) {
    const user = getLoggedInUser();
    if (!user) return;
    const role = String(user.role || "").toUpperCase();
    const normalized = allowedRoles.map(r => String(r).toUpperCase());
    if (!normalized.includes(role)) {
        alert("You do not have permission to access this page.");
        window.location.href = "dashboard.html";
    }
}

function getAuthHeaders(extra = {}) {
    const token = localStorage.getItem("token");
    return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

