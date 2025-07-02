const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const COURSE_PATH = path.join(DATA_DIR, "courses.json");
const STUDENT_PATH = path.join(DATA_DIR, "db.json");

function readData(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return defaultValue;
  }
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Obtener todos los cursos o uno por nombre (por query param)
function getAllCourses(req, res) {
  try {
    const courses = readData(COURSE_PATH, []);
    const { name } = req.query;
    if (name) {
      const course = courses.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
      if (!course) {
        return res.status(404).json({ status: 404, message: `Course '${name}' not found` });
      }
      return res.status(200).json({ status: 200, data: course });
    }
    res.status(200).json({ status: 200, data: courses });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error reading courses",
      error: error.message,
    });
  }
}

// Crear un nuevo curso (por query param)
function createCourse(req, res) {
  // No permitir query params en POST
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Query parameters are not allowed",
    });
  }

  // Validar que el body no esté vacío y tenga la propiedad name
  if (!req.body || (!req.body.name && req.body.name !== "")) {
    return res.status(400).json({
      status: 400,
      message: "Course name is required in request body",
    });
  }

  const { name } = req.body;
  const courses = readData(COURSE_PATH, []);

  // Permitir crear varios cursos con un arreglo de strings
  if (Array.isArray(name)) {
    if (name.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Course name array cannot be empty",
      });
    }
    const created = [];
    const errors = [];
    name.forEach((courseName) => {
      if (
        typeof courseName !== "string" ||
        courseName.trim() === "" ||
        !/^[\p{L}\d .'-]+$/u.test(courseName)
      ) {
        errors.push({
          name: courseName,
          message: "Course name is invalid or contains invalid characters",
        });
        return;
      }
      if (
        courses.find(
          (c) => c.name.toLowerCase() === courseName.trim().toLowerCase()
        )
      ) {
        errors.push({
          name: courseName,
          message: "Course already exists",
        });
        return;
      }
      const newCourse = { name: courseName.trim(), students: [] };
      courses.push(newCourse);
      created.push(newCourse);
    });
    writeData(COURSE_PATH, courses);
    return res.status(201).json({
      status: 201,
      message: "Courses processed",
      created,
      errors,
    });
  }

  // crear un solo curso
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .json({ status: 400, message: "Course name is required" });
  }
  if (!/^[\p{L}\d .'-]+$/u.test(name)) {
    return res
      .status(400)
      .json({ message: "Course name contains invalid characters" });
  }
  if (courses.find((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
    return res
      .status(409)
      .json({ status: 409, message: "Course already exists" });
  }
  const newCourse = { name: name.trim(), students: [] };
  courses.push(newCourse);
  writeData(COURSE_PATH, courses);
  res
    .status(201)
    .json({ status: 201, message: "Course created successfully", data: newCourse });
}

// Eliminar un curso (por query param)
function deleteCourse(req, res) {
  const name = req.query.name;
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      status: 400,
      message: "Course name is required as query param",
    });
  }
  if (!/^[\p{L}\d .'-]+$/u.test(name)) {
    return res
      .status(400)
      .json({ message: "Course name contains invalid characters" });
  }
  let courses = readData(COURSE_PATH, []);
  const index = courses.findIndex((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  if (index === -1) {
    return res.status(404).json({ status: 404, message: `Course '${name}' not found` });
  }
  const deleted = courses.splice(index, 1)[0];
  writeData(COURSE_PATH, courses);

  // Eliminar el curso de todos los estudiantes en db.json
  let students = readData(STUDENT_PATH, []);
  for (let i = 0; i < students.length; i++) {
    if (Array.isArray(students[i].courses)) {
      students[i].courses = students[i].courses.filter(
        (c) => c.trim().toLowerCase() !== name.trim().toLowerCase()
      );
    }
  }
  writeData(STUDENT_PATH, students);

  res.status(200).json({
    status: 200,
    message: `Course '${name}' deleted from system and all students`,
    data: deleted
  });
}

// Validar estudiante
function validateStudent(student, courses, mockCourses) {
  const courseExists = mockCourses.some(course => course.name === student.course);
  if (!courseExists) {
    return { valid: false, message: "Course does not exist" };
  }
  return { valid: true };
}

module.exports = {
  getAllCourses,
  createCourse,
  deleteCourse,
  validateStudent,
};
