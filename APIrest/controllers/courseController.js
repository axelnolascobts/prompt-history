const fs = require("fs");
const path = require("path");
const DBPATH = path.join(__dirname, "../data/db.json");

// Leer datos
function ReadData() {
  const data = fs.readFileSync(DBPATH, "utf8");
  return JSON.parse(data);
}

// Guardar datos
function WriteData(data) {
  fs.writeFileSync(DBPATH, JSON.stringify(data, null, 2));
}

// Crear un nuevo curso
exports.createCourse = (req, res) => {
  const { course } = req.body;
  if (!course || typeof course !== "string" || course.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course name is required",
      data: null
    });
  }
  // No hay lista global de cursos, solo validamos que el nombre sea válido
  res.status(201).json({
    status: 201,
    message: "Course created (add to students via student endpoints)",
    data: { course: course.trim() }
  });
};

// Obtener alumnos de un curso (usando query param)
exports.getCourseStudents = (req, res) => {
  const course = req.query.course;
  if (!course || typeof course !== "string" || course.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course query param is required",
      data: null
    });
  }
  const students = ReadData();
  const normalized = course.trim().toLowerCase();
  const enrolled = students.filter(s =>
    s.courses.map(c => c.trim().toLowerCase()).includes(normalized)
  );
  // Siempre 200, aunque enrolled sea []
  return res.status(200).json({
    status: 200,
    message: "Students retrieved for course",
    data: enrolled
  });
};

// Eliminar un curso de todos los alumnos (usando query param)
exports.deleteCourse = (req, res) => {
  const course = req.query.course;
  if (!course || typeof course !== "string" || course.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course query param is required",
      data: null
    });
  }
  let students = ReadData();
  const normalized = course.trim().toLowerCase();
  let found = false;
  students = students.map(s => {
    const before = s.courses.length;
    s.courses = s.courses.filter(c => c.trim().toLowerCase() !== normalized);
    if (s.courses.length < before) found = true;
    return s;
  });
  if (!found) {
    return res.status(404).json({
      status: 404,
      message: "Course not found",
      data: null
    });
  }
  WriteData(students);
  res.status(200).json({
    status: 200,
    message: "Course deleted from all students",
    data: course
  });
};