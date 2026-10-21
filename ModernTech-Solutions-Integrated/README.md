
# ModernTech Solutions — Integrated HR Portal

The project separates the web interface and API into `frontend/` and `backend/` while preserving the supplied frontend designs. The backend serves the frontend and API from one Express server, using a single MySQL database.

## Project structure
- `frontend/` — HTML, CSS, and browser JavaScript
- `backend/` — Express API, database scripts, and Node.js configuration

## Included modules
- Login/authentication (username or email, role-aware user data)
- Dashboard backed by MySQL metrics
- Employee directory CRUD and search
- Attendance records
- Leave requests and HR approval/denial
- Payroll CRUD and payslip/summary frontend
- Performance ratings/reports data
- Shared MySQL connection pool and environment configuration

## Quick start
1. Install Node.js 18+ and MySQL 8+.
2. In MySQL Workbench, open `backend/database/modern_tech.sql` and run the entire script.
3. Copy `backend/.env.example` to `backend/.env` if needed, then update the MySQL credentials.
4. Open a terminal in the `backend/` folder and run `npm install`.
5. Run `npm start` from `backend/`.
6. Browse to `http://localhost:5000` (or the port configured in `backend/.env`).

## Demo logins
- Employee: `sibo.nkosi` / `Sibo123`
- Employee: `zanele.khumalo` / `Zanele456`
- Manager: `Lungi.manager` / `Manager789`
- HR: `Fatima.admin` / `HR123`

On a successful first login, legacy demo plaintext passwords are automatically replaced in MySQL with bcrypt hashes.

## Environment variables
See `backend/.env.example`. The local `backend/.env` is not committed. Set your own database credentials and JWT secret there.

## Important deployment note
The backend serves the frontend, so the browser can use same-origin API URLs without extra frontend configuration. Netlify can host static HTML, but it cannot run this persistent Node/MySQL server directly. For production, host the Node API on a Node-capable service and use a managed MySQL database.
