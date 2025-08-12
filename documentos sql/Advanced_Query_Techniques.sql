-- 1. Write a SELECT query to list all employee names, their department names, and their salary,
-- also add an extra column “salary_status” that uses the CASE statement to:
-- Show the salary status as "High" if the employee's salary is greater than $70,000.
-- Show "Medium" if the salary is between $50,000 and $70,000.
-- Show "Low" if the salary is below $50,000.
SELECT 
    e.name AS employee_name,
    d.name AS department_name,
    e.salary,
    CASE 
        WHEN e.salary > 70000 THEN 'High'
        WHEN e.salary BETWEEN 50000 AND 70000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_status
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- 2. Create a function average_salary_by_department(department_id INT) that takes a department_id
-- as input and returns the average salary of employees in that department.
CREATE OR REPLACE FUNCTION average_salary_by_department(p_department_id INT)
RETURNS NUMERIC AS $$
DECLARE
    avg_salary NUMERIC;
BEGIN
    SELECT AVG(salary)
    INTO avg_salary
    FROM employees
    WHERE department_id = p_department_id;

    RETURN avg_salary;
END;
$$ LANGUAGE plpgsql;


-- Test the function
SELECT average_salary_by_department(1); -- Replace 1 with the desired department_id

-- 3. Create the following roles and assign the appropriate permissions to each:
--admin (full access to all tables and actions).
CREATE ROLE admintest WITH LOGIN PASSWORD 'admin_password';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admintest;

--hr_manager (can add, update, or delete employees data and view the departments data).
CREATE ROLE hr_managertest WITH LOGIN PASSWORD 'hr_manager_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO hr_managertest;
GRANT SELECT ON public.departments TO hr_managertest;

--employee (can view employee data, but can’t modify it).
CREATE ROLE employees WITH LOGIN PASSWORD 'employee_password';
GRANT SELECT ON employees TO employees;

--Revoke PermissionsRevoke the hr_manager role’s permission to delete departments from the database.
REVOKE DELETE ON departments FROM hr_manager;
