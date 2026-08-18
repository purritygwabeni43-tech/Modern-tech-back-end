CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    employment_history TEXT,
    contact VARCHAR(255) NOT NULL,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);


CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);


CREATE TABLE leave_requests (
    leave_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    leave_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);


CREATE TABLE payroll (
    payroll_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    hours_worked INT NOT NULL,
    leave_deductions INT NOT NULL,
    final_salary DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);

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


INSERT INTO employees
(employee_id, name, position, department_id, salary, employment_history, contact)
VALUES
(1, 'Sibongile Nkosi', 'Software Engineer', 1, 70000.00,
 'Joined in 2015, promoted to Senior in 2018',
 'sibongile.nkosi@moderntech.com'),

(2, 'Lungile Moyo', 'HR Manager', 2, 80000.00,
 'Joined in 2013, promoted to Manager in 2017',
 'lungile.moyo@moderntech.com'),

(3, 'Thabo Molefe', 'Quality Analyst', 3, 55000.00,
 'Joined in 2018',
 'thabo.molefe@moderntech.com'),

(4, 'Keshav Naidoo', 'Sales Representative', 4, 60000.00,
 'Joined in 2020',
 'keshav.naidoo@moderntech.com'),

(5, 'Zanele Khumalo', 'Marketing Specialist', 5, 58000.00,
 'Joined in 2019',
 'zanele.khumalo@moderntech.com'),

(6, 'Sipho Zulu', 'UI/UX Designer', 6, 65000.00,
 'Joined in 2016',
 'sipho.zulu@moderntech.com'),

(7, 'Naledi Moeketsi', 'DevOps Engineer', 7, 72000.00,
 'Joined in 2017',
 'naledi.moeketsi@moderntech.com'),

(8, 'Farai Gumbo', 'Content Strategist', 5, 56000.00,
 'Joined in 2021',
 'farai.gumbo@moderntech.com'),

(9, 'Karabo Dlamini', 'Accountant', 8, 62000.00,
 'Joined in 2018',
 'karabo.dlamini@moderntech.com'),

(10, 'Fatima Patel', 'Customer Support Lead', 9, 58000.00,
 'Joined in 2016',
 'fatima.patel@moderntech.com');


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


INSERT INTO leave_requests
(employee_id, leave_date, reason, status)
VALUES

-- Employee 1
(1, '2025-07-22', 'Sick Leave', 'Approved'),
(1, '2024-12-01', 'Personal', 'Pending'),

-- Employee 2
(2, '2025-07-15', 'Family Responsibility', 'Denied'),
(2, '2024-12-02', 'Vacation', 'Approved'),

-- Employee 3
(3, '2025-07-10', 'Medical Appointment', 'Approved'),
(3, '2024-12-05', 'Personal', 'Pending'),

-- Employee 4
(4, '2025-07-20', 'Bereavement', 'Approved'),

-- Employee 5
(5, '2024-12-01', 'Childcare', 'Pending'),

-- Employee 6
(6, '2025-07-18', 'Sick Leave', 'Approved'),

-- Employee 7
(7, '2025-07-22', 'Vacation', 'Pending'),

-- Employee 8
(8, '2024-12-02', 'Medical Appointment', 'Approved'),

-- Employee 9
(9, '2025-07-19', 'Childcare', 'Denied'),

-- Employee 10
(10, '2024-12-03', 'Vacation', 'Pending');


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