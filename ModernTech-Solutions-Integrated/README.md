
# ModernTech Solutions — Integrated HR Portal

This folder merges the supplied ModernTech branches into one runnable project while preserving the supplied frontend designs. It uses a single Node/Express server and a single MySQL database.

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
2. In MySQL Workbench, open `database/modern_tech.sql` and run the entire script.
3. Edit `.env` if your MySQL username/password/port differ from the defaults.
4. Open a terminal in this project folder and run `npm install`.
5. Run `npm start`.
6. Browse to `http://localhost:3000`.

## Demo logins
- Employee: `sibo.nkosi` / `Sibo123`
- Employee: `zanele.khumalo` / `Zanele456`
- Manager: `Lungi.manager` / `Manager789`
- HR: `Fatima.admin` / `HR123`

On a successful first login, legacy demo plaintext passwords are automatically replaced in MySQL with bcrypt hashes.

## Environment variables
See `.env.example`. For local MySQL with no root password, the included `.env` works as-is. If your MySQL root account has a password, put it in `DB_PASSWORD`.

## Important deployment note
The frontend and API are designed to be served together by this Express server. Netlify can host static HTML, but it cannot run this persistent Node/MySQL server directly. For production, host the Node API on a Node-capable service and use a managed MySQL database, then adjust frontend API URLs if frontend/backend are separated.

