CREATE TABLE students (
  student_id INT PRIMARY KEY,
  student_name TEXT NOT NULL
);


CREATE TABLE courses (
  course_id INT PRIMARY KEY,
  course_name TEXT NOT NULL,
  professor TEXT NOT NULL
);

CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  semester TEXT NOT NULL,
  grade INT CHECK (grade >= 0 AND grade <= 100),
  PRIMARY KEY (student_id, course_id, semester),
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- insercion de archivos SQL
psql -U MiltonM -d test -f /home/bts/Downloads/students.sql
psql -U MiltonM -d test -f /home/bts/Downloads/courses.sql
psql -U MiltonM -d test -f /home/bts/Downloads/enrollments.sql


--Estudiantes inscritos en "Database Systems"

SELECT 
    s.student_name,
    c.course_name,
    e.grade
FROM 
    enrollments e
JOIN 
    students s ON e.student_id = s.student_id
JOIN 
    courses c ON e.course_id = c.course_id
WHERE 
    c.course_name = 'Database Systems';

-- Crear índices BTREE en columnas frecuentemente filtradas
-- Mejora la velocidad de JOIN y búsquedas por nombre o ID
CREATE INDEX idx_course_name ON courses(course_name);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- EXPLAIN ANALYZE: analizar el rendimiento de la consulta
EXPLAIN ANALYZE
SELECT 
    s.student_name,
    c.course_name,
    e.grade
FROM 
    enrollments e
JOIN 
    students s ON e.student_id = s.student_id
JOIN 
    courses c ON e.course_id = c.course_id
WHERE 
    c.course_name = 'Database Systems';

-- Crear una VISTA para mostrar inscripciones completas
CREATE OR REPLACE VIEW v_student_enrollments AS
SELECT 
    s.student_name,
    c.course_name,
    c.professor,
    e.grade,
    e.semester
FROM 
    enrollments e
JOIN 
    students s ON e.student_id = s.student_id
JOIN 
    courses c ON e.course_id = c.course_id;

--Consultar la vista filtrando por nombre del estudiante
SELECT *
FROM v_student_enrollments
WHERE student_name = 'Loretta Swatheridge';