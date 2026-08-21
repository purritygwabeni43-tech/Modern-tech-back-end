
# ModernTech Solutions — Run Guide

## 1. Requirements
Install these first:
- Node.js 18 or newer
- MySQL Server 8.x
- MySQL Workbench (recommended for importing the database)
- Use `npm install`

## 2. Create the MySQL database
1. Start the MySQL Server service.
2. Open MySQL Workbench and connect to your local MySQL server.
3. Open `database/modern_tech.sql`.
4. Run the whole SQL script.
5. Refresh **Schemas** and confirm that `modern_tech` exists.
6. Confirm these tables exist: `roles`, `departments`, `employees`, `users`, `attendance`, `leave_requests`, `payroll`, `performance_reviews`.

> The setup SQL drops and recreates the ModernTech project tables, so do not run it against a database containing data you need to keep.

## 3. Configure `.env`
Open `.env` in the project root and update the MySQL credentials if necessary:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=put in your password
DB_NAME=modern_tech2
DB_CONNECTION_LIMIT=10
JWT_SECRET=change_this_to_a_long_random_secret_before_production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

If your MySQL `root` account has a password, put it after `DB_PASSWORD=`.

## 4. Install Node dependencies
Open Command Prompt / PowerShell inside the project folder and run:

```bash
npm install
```

## 5. Start the project
Run:

```bash
npm run dev
```

You should see messages similar to:

```text
MySQL connected to modern_tech2
ModernTech running on http://localhost:3000
```

Then open:

```text
http://localhost:3000
```

Do not open the HTML files by double-clicking them. The frontend should be opened through the Express server so its API calls can reach Node/MySQL.

## 6. Demo accounts
| Role | Username | Password |
|---|---|---|
| Employee | `sibo.nkosi` | `Sibo123` |
| Employee | `zanele.khumalo` | `Zanele456` |
| Manager | `Lungi.manager` | `Manager789` |
| HR | `Fatima.admin` | `HR123` |

The demo passwords start as legacy seed values. After the first successful login, the server automatically upgrades that user's password in MySQL to a bcrypt hash.

## 7. Main pages
- `/login.html` — Login
- `/dashboard.html` — Dashboard metrics from MySQL
- `/employees.html` — Employee CRUD/search
- `/attendance.html` — Attendance records
- `/leave.html` — Leave requests and approval/denial
- `/payroll.html` — Payroll CRUD/payslip tools
- `/reports.html` — Performance ratings/reviews
- `/health` — API/database health check

## Troubleshooting
### `ECONNREFUSED 127.0.0.1:3306`
MySQL Server is not running. On Windows, open **Services**, find a service such as **MySQL80**, and start/restart it. If you use XAMPP/WAMP, start MySQL there instead.

### `Access denied for user 'root'@'localhost'`
The username/password in `.env` does not match your MySQL account. Fix `DB_USER` and `DB_PASSWORD`, then restart `npm start`.

### `Unknown database 'modern_tech2'`
Run `database/modern_tech.sql` in MySQL Workbench first.

### Port 3000 is already in use
Change `PORT=3000` to another port such as `PORT=3001` in `.env`, restart the server, then open that new port. The frontend uses relative API URLs, so no frontend code changes are required.

### `npm` is not recognized
Install Node.js and reopen the terminal.

### Page loads but data is empty/erroring
Open `http://localhost:5000/health`. If it reports `database: Disconnected`, fix the MySQL/.env configuration first.

