CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT REFERENCES departments(id)
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    budget DECIMAL(12,2) NOT NULL
);

CREATE TABLE employee_projects (
    employee_id INT REFERENCES employees(id),
    project_id INT REFERENCES projects(id),
    PRIMARY KEY (employee_id, project_id)
);

-- Insert Departments
INSERT INTO departments (name) VALUES
('Engineering'),
('Marketing'),
('Sales'),
('HR'),
('Finance'),
('IT'),
('Customer Support');

-- Insert Employees (50 employees distributed across departments)
INSERT INTO employees (name, position, salary, department_id) VALUES
('Alice Johnson', 'Software Engineer', 75000, 1),
('Bob Smith', 'Software Engineer', 72000, 1),
('Charlie Brown', 'Data Analyst', 65000, 1),
('David White', 'Marketing Specialist', 55000, 2),
('Eve Black', 'Marketing Manager', 67000, 2),
('Frank Green', 'Sales Representative', 48000, 3),
('Grace Blue', 'Sales Manager', 70000, 3),
('Hank Adams', 'HR Coordinator', 50000, 4),
('Ivy Wilson', 'HR Manager', 62000, 4),
('Jack Taylor', 'Accountant', 68000, 5),
('Karen Lopez', 'Financial Analyst', 72000, 5),
('Leo Perez', 'IT Support', 52000, 6),
('Mia Collins', 'IT Administrator', 60000, 6),
('Nathan Scott', 'Customer Support Representative', 45000, 7),
('Olivia Evans', 'Customer Support Manager', 62000, 7),
('Paul Harris', 'Software Engineer', 78000, 1),
('Quincy Lewis', 'Software Engineer', 74000, 1),
('Rachel Hall', 'Data Scientist', 85000, 1),
('Steve Allen', 'Marketing Intern', 40000, 2),
('Tina Young', 'Marketing Coordinator', 52000, 2),
('Umar Khan', 'Sales Representative', 49000, 3),
('Victor Torres', 'Sales Consultant', 72000, 3),
('Wendy Martin', 'HR Assistant', 47000, 4),
('Xander Clark', 'HR Specialist', 53000, 4),
('Yvonne Moore', 'Financial Controller', 75000, 5),
('Zach Reed', 'Investment Analyst', 73000, 5),
('Amelia King', 'IT Security Analyst', 77000, 6),
('Brandon Baker', 'Network Engineer', 69000, 6),
('Chloe Foster', 'Customer Success Rep', 48000, 7),
('Derek Russell', 'Customer Experience Lead', 64000, 7),
('Ethan Fisher', 'Software Developer', 76000, 1),
('Fiona Woods', 'UX Designer', 71000, 1),
('George Simmons', 'Marketing Analyst', 56000, 2),
('Holly Turner', 'SEO Specialist', 62000, 2),
('Ian Murphy', 'Sales Trainee', 45000, 3),
('Jane Robinson', 'Key Account Manager', 73000, 3),
('Kevin Walker', 'HR Recruiter', 54000, 4),
('Laura Hernandez', 'HR Generalist', 60000, 4),
('Mark Phillips', 'Risk Manager', 78000, 5),
('Nina Edwards', 'Tax Consultant', 76000, 5),
('Oscar Simmons', 'Cloud Engineer', 82000, 6),
('Peter Gonzales', 'DevOps Engineer', 84000, 6),
('Quinn Taylor', 'Technical Support', 50000, 6),
('Ryan Carter', 'Customer Support Agent', 46000, 7),
('Sophia Brooks', 'Call Center Supervisor', 61000, 7),
('Tom Wright', 'Software Architect', 92000, 1),
('Ursula Diaz', 'Machine Learning Engineer', 88000, 1),
('Vincent Powell', 'Cybersecurity Specialist', 87000, 6),
('Walter Lee', 'Database Administrator', 81000, 6);

-- Insert Projects (10 projects)
INSERT INTO projects (name, budget) VALUES
('AI Research Initiative', 500000),
('Website Redesign', 120000),
('Sales Optimization Tool', 150000),
('Employee Wellness Program', 80000),
('Market Expansion Strategy', 130000),
('Cloud Infrastructure Upgrade', 300000),
('Cybersecurity Enhancement', 200000),
('Customer Support AI Bot', 90000),
('Data Analytics Dashboard', 250000),
('SEO Growth Campaign', 70000);

-- Insert Employee-Project Assignments (Random distribution)
INSERT INTO employee_projects (employee_id, project_id) VALUES
(1, 1), (2, 1), (3, 1), (16, 1), (32, 1),
(17, 2), (31, 2), (33, 2), (10, 2),
(6, 3), (22, 3), (21, 3), (35, 3),
(8, 4), (9, 4), (24, 4), (23, 4),
(4, 5), (5, 5), (20, 5), (34, 5),
(12, 6), (13, 6), (28, 6), (29, 6), (42, 6),
(14, 7), (15, 7), (44, 7),
(19, 8), (45, 8), (46, 8),
(18, 9), (47, 9), (48, 9),
(11, 10), (49, 10);
