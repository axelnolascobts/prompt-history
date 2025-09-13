--Emploee table:

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    balance NUMERIC(2) DEFAULT 0 NOT NULL,
    contract_date DATE NOT NULL
);


-- Rol table

CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    rol_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO rol (rol_name) VALUES
('employee'),
('office_admin'),
('people_group_manager'),
('director_of_operations'),
('CEO'),
('financial_responsible');
