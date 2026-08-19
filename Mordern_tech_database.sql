-- =========================================================
-- DROP AND RECREATE DATABASE
-- =========================================================

DROP DATABASE IF EXISTS modern_tech;

CREATE DATABASE modern_tech;

USE modern_tech;


-- =========================================================
-- DEPARTMENTS
-- =========================================================

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================
-- EMPLOYEES
-- employee_id:
--   - AUTO_INCREMENT = generated automatically
--   - PRIMARY KEY = unique, cannot be duplicated
-- =========================================================

CREATE TABLE employees (
    employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    employment_history TEXT,
    contact VARCHAR(255) NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);


-- =========================================================
-- ATTENDANCE
-- =========================================================

CREATE TABLE attendance (
    attendance_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);


-- =========================================================
-- LEAVE REQUESTS
-- =========================================================

CREATE TABLE leave_requests (
    leave_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);


-- =========================================================
-- PAYROLL
-- =========================================================

CREATE TABLE payroll (
    payroll_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    hours_worked INT NOT NULL,
    leave_deductions INT NOT NULL,
    final_salary DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);


-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);


-- =========================================================
-- INSERT DEPARTMENTS
-- =========================================================

INSERT INTO departments (department_name)
VALUES
('Development'),
('HR'),
('QA'),
('Sales'),
('Marketing'),
('Design'),
('IT'),
('Finance'),
('Support');


-- =========================================================
-- INSERT EMPLOYEES
--
-- Notice:
-- We DO NOT insert employee_id.
-- MySQL automatically generates:
-- 1, 2, 3, 4, ... 10
-- =========================================================

INSERT INTO employees
(name, position, department_id, salary, employment_history, contact)
VALUES
(
    'Sibongile Nkosi',
    'Software Engineer',
    1,
    70000.00,
    'Joined in 2015, promoted to Senior in 2018',
    'sibongile.nkosi@moderntech.com'
),
(
    'Lungile Moyo',
    'HR Manager',
    2,
    80000.00,
    'Joined in 2013, promoted to Manager in 2017',
    'lungile.moyo@moderntech.com'
),
(
    'Thabo Molefe',
    'Quality Analyst',
    3,
    55000.00,
    'Joined in 2018',
    'thabo.molefe@moderntech.com'
),
(
    'Keshav Naidoo',
    'Sales Representative',
    4,
    60000.00,
    'Joined in 2020',
    'keshav.naidoo@moderntech.com'
),
(
    'Zanele Khumalo',
    'Marketing Specialist',
    5,
    58000.00,
    'Joined in 2019',
    'zanele.khumalo@moderntech.com'
),
(
    'Sipho Zulu',
    'UI/UX Designer',
    6,
    65000.00,
    'Joined in 2016',
    'sipho.zulu@moderntech.com'
),
(
    'Naledi Moeketsi',
    'DevOps Engineer',
    7,
    72000.00,
    'Joined in 2017',
    'naledi.moeketsi@moderntech.com'
),
(
    'Farai Gumbo',
    'Content Strategist',
    5,
    56000.00,
    'Joined in 2021',
    'farai.gumbo@moderntech.com'
),
(
    'Karabo Dlamini',
    'Accountant',
    8,
    62000.00,
    'Joined in 2018',
    'karabo.dlamini@moderntech.com'
),
(
    'Fatima Patel',
    'Customer Support Lead',
    9,
    58000.00,
    'Joined in 2016',
    'fatima.patel@moderntech.com'
);


-- =========================================================
-- INSERT ATTENDANCE
-- =========================================================

INSERT INTO attendance
(employee_id, attendance_date, status)
VALUES

-- Employee 1
(1, '2025-07-25', 'Present'),
(1, '2025-07-26', 'Absent'),
(1, '2025-07-27', 'Present'),
(1, '2025-07-28', 'Present'),
(1, '2025-07-29', 'Present'),

-- Employee 2
(2, '2025-07-25', 'Present'),
(2, '2025-07-26', 'Present'),
(2, '2025-07-27', 'Absent'),
(2, '2025-07-28', 'Present'),
(2, '2025-07-29', 'Present'),

-- Employee 3
(3, '2025-07-25', 'Present'),
(3, '2025-07-26', 'Present'),
(3, '2025-07-27', 'Present'),
(3, '2025-07-28', 'Absent'),
(3, '2025-07-29', 'Present'),

-- Employee 4
(4, '2025-07-25', 'Absent'),
(4, '2025-07-26', 'Present'),
(4, '2025-07-27', 'Present'),
(4, '2025-07-28', 'Present'),
(4, '2025-07-29', 'Present'),

-- Employee 5
(5, '2025-07-25', 'Present'),
(5, '2025-07-26', 'Present'),
(5, '2025-07-27', 'Absent'),
(5, '2025-07-28', 'Present'),
(5, '2025-07-29', 'Present'),

-- Employee 6
(6, '2025-07-25', 'Present'),
(6, '2025-07-26', 'Present'),
(6, '2025-07-27', 'Absent'),
(6, '2025-07-28', 'Present'),
(6, '2025-07-29', 'Present'),

-- Employee 7
(7, '2025-07-25', 'Present'),
(7, '2025-07-26', 'Present'),
(7, '2025-07-27', 'Present'),
(7, '2025-07-28', 'Absent'),
(7, '2025-07-29', 'Present'),

-- Employee 8
(8, '2025-07-25', 'Present'),
(8, '2025-07-26', 'Absent'),
(8, '2025-07-27', 'Present'),
(8, '2025-07-28', 'Present'),
(8, '2025-07-29', 'Present'),

-- Employee 9
(9, '2025-07-25', 'Present'),
(9, '2025-07-26', 'Present'),
(9, '2025-07-27', 'Present'),
(9, '2025-07-28', 'Absent'),
(9, '2025-07-29', 'Present'),

-- Employee 10
(10, '2025-07-25', 'Present'),
(10, '2025-07-26', 'Present'),
(10, '2025-07-27', 'Absent'),
(10, '2025-07-28', 'Present'),
(10, '2025-07-29', 'Present');


-- =========================================================
-- INSERT LEAVE REQUESTS
-- =========================================================

INSERT INTO leave_requests
(employee_id, leave_date, reason, status)
VALUES

(1, '2025-07-22', 'Sick Leave', 'Approved'),
(1, '2024-12-01', 'Personal', 'Pending'),

(2, '2025-07-15', 'Family Responsibility', 'Denied'),
(2, '2024-12-02', 'Vacation', 'Approved'),

(3, '2025-07-10', 'Medical Appointment', 'Approved'),
(3, '2024-12-05', 'Personal', 'Pending'),

(4, '2025-07-20', 'Bereavement', 'Approved'),

(5, '2024-12-01', 'Childcare', 'Pending'),

(6, '2025-07-18', 'Sick Leave', 'Approved'),

(7, '2025-07-22', 'Vacation', 'Pending'),

(8, '2024-12-02', 'Medical Appointment', 'Approved'),

(9, '2025-07-19', 'Childcare', 'Denied'),

(10, '2024-12-03', 'Vacation', 'Pending');


-- =========================================================
-- INSERT PAYROLL
-- =========================================================

INSERT INTO payroll
(employee_id, hours_worked, leave_deductions, final_salary)
VALUES
(1, 160, 8, 69500.00),
(2, 150, 10, 79000.00),
(3, 170, 4, 54800.00),
(4, 165, 6, 59700.00),
(5, 158, 5, 57850.00),
(6, 168, 2, 64800.00),
(7, 175, 3, 71800.00),
(8, 160, 0, 56000.00),
(9, 155, 5, 61500.00),
(10, 162, 4, 57750.00);


-- =========================================================
-- INSERT USERS
-- =========================================================

INSERT INTO users
(employee_id, username, password_hash, role)
VALUES
(1, 'sibo.nkosi', 'Sibo123', 'EMPLOYEE'),
(5, 'zanele.khumalo', 'Zanele456', 'EMPLOYEE'),
(2, 'Lungi.manager', 'Manager789', 'MANAGER'),
(10, 'Fatima.admin', 'HR123', 'HR');


-- =========================================================
-- VERIFY DATA
-- =========================================================

SELECT * FROM departments;

SELECT * FROM employees;

SELECT * FROM attendance;

SELECT * FROM leave_requests;

SELECT * FROM payroll;

SELECT * FROM users;