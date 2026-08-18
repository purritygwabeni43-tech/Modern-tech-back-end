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

    if (!user) {
        return null;
    }

    return user.role.toUpperCase();
}


function requireRole(allowedRoles) {
    const user = getLoggedInUser();

    if (!user) {
        return;
    }

    const role = user.role.toUpperCase();

    if (!allowedRoles.includes(role)) {
        alert("You do not have permission to access this page.");

        window.location.href = "dashboard.html";
    }
}


function logout() {
    localStorage.removeItem("user");

    window.location.href = "login.html";
}