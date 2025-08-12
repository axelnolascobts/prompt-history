-- 1. Update all employees in the "Sales" department to receive a 10% salary increase.
BEGIN;
UPDATE employees SET salary = salary * 1.10; 
SELECT name, position, salary FROM employees;
COMMIT; 
ROLLBACK;

-- 2. Remove all employees who have not been assigned to any project.
BEGIN;
DELETE FROM employees
WHERE id NOT IN (
    SELECT employee_id FROM employee_projects
);
COMMIT;
ROLLBACK;

/* 3. Enforce Data Integrity
Modify the "employees" table to ensure that no salary is lower than $15,000.
Ensure that the "name" field in the "departments" table is unique.*/ 
BEGIN;
ALTER TABLE employees
ADD CONSTRAINT min_salary CHECK (salary >= 15000);
-- test error
UPDATE employees SET salary = 14000 WHERE id = 1; 
ROLLBACK;
COMMIT;


BEGIN;
ALTER TABLE departments
ADD CONSTRAINT unique_department_name UNIQUE (name);
-- test error
INSERT INTO departments (name) VALUES ('Sales');
COMMIT;
ROLLBACK;

/* 4. Foreign Key Validation
Try to delete a department that still has employees assigned.
What happens? Why?
How would you modify the database schema to allow cascading deletes?
*/
BEGIN;
DELETE FROM departments WHERE id = 1;
-- This will fail if there are employees assigned to the department.
-- To allow cascading deletes, you would modify the foreign key constraint in the employees table to include ON DELETE CASCADE.
ALTER TABLE employees
DROP CONSTRAINT employees_department_id_fkey;
ALTER TABLE employees
ADD CONSTRAINT employees_department_id_fkey
FOREIGN KEY (department_id)
REFERENCES departments(id)
ON DELETE CASCADE;
ROLLBACK;

/* 5. Cuando intentamos eliminar un departamento que aún tiene empleados asociados, PostgreSQL lanza un error por violar la integridad referencial. Esto sucede porque hay una clave foránea (department_id) en la tabla employees que depende de la tabla departments.

Para permitir que al eliminar un departamento también se eliminen automáticamente todos sus empleados asociados, debemos modificar la restricción de clave foránea usando ON DELETE CASCADE.

Esto asegura que cualquier empleado ligado a un departamento eliminado se borre automáticamente junto con él.
*/

-- 6. Rank Employees by Salary Within Their Department
BEGIN;
SELECT e.name, e.salary, d.name AS department_name,
       RANK() OVER (PARTITION BY d.name ORDER BY e.salary DESC) AS salary_rank
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY d.name, salary_rank;
COMMIT;
ROLLBACK;

/* EXTRA ejemplo de transacción con rollback
-- Simulación de una transacción que reduce el inventario y crea una orden.
-- Si algo falla, se revertirá todo lo que se hizo en la transacción.
-- Esto es un ejemplo de cómo manejar transacciones en SQL.
BEGIN;

-- 1. Reducir inventario
UPDATE products SET stock = stock - 1 WHERE id = 100;

-- 2. Crear orden
INSERT INTO orders (user_id, product_id, status) VALUES (42, 100, 'paid');
Si el producto ya no está en stock, se hace ROLLBACK y no se crea la orden sin inventario.
COMMIT;
 */