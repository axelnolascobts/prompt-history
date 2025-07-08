-- List all employees' names, positions, and salaries.
SELECT name, position, salary FROM employees;
-- Show all employees who have a salary higher than $50,000
SELECT name, salary FROM employees WHERE salary > 50000;
-- Display a list of projects ordered by budget descending
SELECT name, budget FROM projects ORDER BY budget DESC;
-- Find the total number of employees in the company
SELECT COUNT(*) AS total_employees FROM employees;
-- Get a list of departments and the total salary expense per department, 
--ordered by the most to the least expensive.
SELECT d.name AS department_name, SUM(e.salary) AS total_salary
FROM departments d
JOIN employees e ON d.id = e.department_id
GROUP BY d.name
ORDER BY total_salary DESC;
-- Find the total budget assigned to all projects.
SELECT SUM(budget) AS total_project_budget FROM projects;
-- Get the average salary per department.
SELECT d.name AS department_name, AVG(e.salary) AS average_salary
FROM departments d
JOIN employees e ON d.id = e.department_id
GROUP BY d.name
ORDER BY average_salary DESC;
-- Count how many employees are in each department (only show departments with at least 2 employees).
SELECT d.name AS department_name, COUNT(e.id) AS employee_count
FROM departments d
JOIN employees e ON d.id = e.department_id
GROUP BY d.name
HAVING COUNT(e.id) >= 2
ORDER BY employee_count DESC;
-- Show all projects along with the employees assigned to them (even if no one is assigned).
SELECT p.name AS project_name, 
       COALESCE(e.name, 'No Employee Assigned') AS employee_name
FROM projects p
LEFT JOIN employee_projects ep ON p.id = ep.project_id
LEFT JOIN employees e ON ep.employee_id = e.id
ORDER BY p.name, e.name;
-- Get a list of all employees who are NOT assigned to any project ordered alphabetically.
SELECT e.name AS employee_name
FROM employees e
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
WHERE ep.project_id IS NULL
ORDER BY e.name;