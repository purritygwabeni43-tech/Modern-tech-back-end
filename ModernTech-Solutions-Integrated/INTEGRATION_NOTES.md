
# Integration Notes

The supplied branches were consolidated around one ES module Express application and one `modern_tech2` MySQL schema.

- **backend-dev** supplied the strongest base for authentication, dashboard concepts, models, middleware, and performance-review data.
- **feature-employee-module** supplied the employee management frontend and CRUD behavior.
- **payroll-data** supplied the login/dashboard/payroll frontend and payroll CRUD behavior.
- **attendance-leaverequest** supplied attendance/leave API behavior and the leave-management frontend.

Key conflicts resolved during the merge:
- Unified database naming to `modern_tech2`.
- Unified two incompatible user schemas while retaining username-based frontend login and role-based authentication.
- Replaced separate hard-coded MySQL connections with one shared environment-driven connection pool.
- Changed frontend API calls to same-origin relative module URLs so one server/port runs the whole project.
- Corrected employee department selection to load the actual department IDs/names from MySQL.
- Retained legacy endpoint aliases where useful for compatibility.
- Added the missing attendance/report destinations so the supplied navigation does not lead to dead pages.
- Preserved the supplied CSS files unchanged and only adjusted wiring/path code around them.
- Removed the uploaded branch's real-looking local DB password/JWT secret from the integrated output.

