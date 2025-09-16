-- Employee table:

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    balance NUMERIC(2) DEFAULT 0 NOT NULL,
    contract_date DATE NOT NULL
);

-- Role table:

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

-- Teams table:

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL
);

-- Country table:

CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Policy table:

CREATE TABLE policy (
    id SERIAL PRIMARY KEY,
    country_id INT,
    policy TEXT,
    FOREIGN KEY (country_id) REFERENCES country(id)
);

-- Office table:

CREATE TABLE office (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES country(id)
);

-- Users table:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(35) NOT NULL,
    rol_id INT,
    office_id INT,
    team_id INT,
    FOREIGN KEY (rol_id) REFERENCES rol(id),
    FOREIGN KEY (office_id) REFERENCES office(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Free day type table:

CREATE TABLE free_day_type (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO free_day_type (type_name) VALUES
('vacations'),
('sick leave'),
('unpaid leave'),
('special reason');

-- Request status table:

CREATE TABLE request_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO request_status (status_name) VALUES
('pending'),
('accepted'),
('rejected');

-- Requests table:

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    client_confirmation BYTEA,
    employee_id INT,
    free_day_type_id INT,
    request_date DATE NOT NULL,
    initial_date DATE NOT NULL,
    end_date DATE NOT NULL,
    request_status INT,
    response_day DATE,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (free_day_type_id) REFERENCES free_day_type(id),
    FOREIGN KEY (request_status) REFERENCES request_status(id)
);

-- Holidays table:

CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES country(id)
);
