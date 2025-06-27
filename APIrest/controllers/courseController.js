const fs = require("fs");
const path = require("path");

const DBPATH = path.join(__dirname, "../data/db.json");
const COURSEPATH = path.join(__dirname, "../data/courses.json");

// Leer datos de estudiantes
function readStudents() {
  const data = fs.readFileSync(DBPATH, "utf8");
  return JSON.parse(data);
}

// Escribir datos de estudiantes
function writeStudents(data) {
  fs.writeFileSync(DBPATH, JSON.stringify(data, null, 2));
}

// Leer lista global de cursos
function readCourses() {
  if (!fs.existsSync(COURSEPATH)) {
    fs.writeFileSync(COURSEPATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(COURSEPATH, "utf8");
  return JSON.parse(data);
}

// Escribir lista global de cursos
function writeCourses(courses) {
  fs.writeFileSync(COURSEPATH, JSON.stringify(courses, null, 2));
}

// Crear un nuevo curso y guardarlo en courses.json
exports.createCourse = (req, res) => {
  const { course } = req.body;
  if (!course || typeof course !== "string" || course.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course name is required",
      data: null
    });
  }

  const normalized = course.trim().toLowerCase();
  const courses = readCourses();

  if (courses.some(c => c.name.toLowerCase() === normalized)) {
    return res.status(409).json({
      status: 409,
      message: "Course already exists",
      data: null
    });
  }
  if (!/^[\p{L}\d .'-]+$/u.test(normalized)) {
    return res.status(400).json({
      status: 400,
      message: "Course name contains invalid characters",
      data: null
    });
  }

  courses.push({ name: normalized, students: [] });
  writeCourses(courses);

  return res.status(201).json({
    status: 201,
    message: "Course created successfully",
    data: { course: normalized }
  });
};

// Obtener alumnos de un curso
exports.getCourseStudents = (req, res) => {
  const course = req.params.course || req.query.course;
  if (!course || typeof course !== "string" || course.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course param is required",
      data: null
    });
  }

  const normalized = course.trim().toLowerCase();
  const courses = readCourses();

  const courseObj = courses.find(c => c.name.toLowerCase() === normalized);
  if (!courseObj) {
    return res.status(404).json({
      status: 404,
      message: `Course '${normalized}' does not exist`,
      data: null
    });
  }

  const students = readStudents();

  // Filtrar estudiantes inscritos en el curso
  const enrolled = students.filter(s =>
    s.courses.some(cName => cName.trim().toLowerCase() === normalized)
  );

  return res.status(200).json({
    status: 200,
    message: `Students retrieved for course '${normalized}'`,
    data: enrolled
  });
};

// Eliminar un curso de todos los alumnos y de courses.json
exports.deleteCourse = (req, res) => {
  const course = req.params.course || req.query.course;
  if (!course || typeof course !== "string" || course.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course param is required",
      data: null
    });
  }

  const normalized = course.trim().toLowerCase();
  let courses = readCourses();

  const courseIndex = courses.findIndex(c => c.name.toLowerCase() === normalized);
  if (courseIndex === -1) {
    return res.status(404).json({
      status: 404,
      message: `Course '${normalized}' not found`,
      data: null
    });
  }

  // Eliminar el curso de todos los estudiantes inscritos
  let students = readStudents();
  students = students.map(s => {
    s.courses = s.courses.filter(c => c.trim().toLowerCase() !== normalized);
    return s;
  });
  writeStudents(students);

  // Eliminar curso de la lista global
  courses.splice(courseIndex, 1);
  writeCourses(courses);

  return res.status(200).json({
    status: 200,
    message: `Course '${normalized}' deleted from system and all students`,
    data: normalized
  });
};
