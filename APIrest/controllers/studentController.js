const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });

addFormats(ajv);

const DBPATH = path.join(__dirname, "../data/db.json");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// JSON Schema para validar estudiantes
const studentSchema = {
  type: "object",
  required: ["name", "email", "courses"],
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    courses: {
      type: "array",
      items: { type: "string" },
      minItems: 1
    },
  },
  additionalProperties: false,
};

const validateStudent = ajv.compile(studentSchema);

const hasDuplicateCourses = (arr) => {
  const normalized = arr.map(c => c.trim().toLowerCase());
  return new Set(normalized).size !== normalized.length;
};

// Leer datos
function ReadData() {
  const data = fs.readFileSync(DBPATH, "utf8");
  return JSON.parse(data);
}

// Guardar datos
function WriteData(data) {
  fs.writeFileSync(DBPATH, JSON.stringify(data, null, 2));
}

// GET estudiantes (filtros por query params: id, name, email, course)
exports.getStudents = (req, res) => {
  const students = ReadData();
  const { id, name, email, course } = req.query;

  let filtered = students;

  if (id) {
    filtered = filtered.filter(s => s.id === id);
  }
  if (name) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (email) {
    filtered = filtered.filter(s => s.email.toLowerCase() === email.toLowerCase());
  }
  if (course) {
    filtered = filtered.filter(s =>
      s.courses.map(c => c.trim().toLowerCase()).includes(course.trim().toLowerCase())
    );
  }

  if (filtered.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "No students found with the given query",
      data: []
    });
  }

  res.status(200).json({
    status: 200,
    message: "Students retrieved successfully",
    data: filtered
  });
};

// POST crear estudiante
exports.createStudent = (req, res) => {
  const students = ReadData();
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body cannot be empty",
      data: null
    });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid input",
      data: validateStudent.errors
    });
  }

  if (students.some((s) => s.email.toLowerCase() === data.email.trim().toLowerCase())) {
    return res.status(400).json({
      status: 400,
      message: "The email already exists",
      data: null
    });
  }

  const trimmedName = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const courses = data.courses;

  if (trimmedName === "") {
    return res.status(400).json({
      status: 400,
      message: "Name cannot be empty",
      data: null
    });
  }

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({
      status: 400,
      message: "Name contains invalid characters",
      data: null
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
      data: null
    });
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Courses must be a non-empty array",
      data: null
    });
  }

  if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
    return res.status(400).json({
      status: 400,
      message: "All courses must be non-empty strings",
      data: null
    });
  }

  if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({
      status: 400,
      message: "Courses contain invalid characters",
      data: null
    });
  }

  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({
      status: 400,
      message: "Courses must not contain duplicates",
      data: null
    });
  }

  const newStudent = {
    id: uuidv4(),
    name: trimmedName,
    email,
    courses,
  };

  students.push(newStudent);
  WriteData(students);

  res.status(201).json({
    status: 201,
    message: "Student created successfully",
    data: newStudent
  });
};

// PUT actualizar estudiante por id o email (query param)
exports.updateStudent = (req, res) => {
  const students = ReadData();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "Query param 'id' or 'email' is required",
      data: null
    });
  }

  let index = -1;
  if (id) {
    index = students.findIndex(s => s.id === id);
  } else if (email) {
    index = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  }

  if (index === -1) {
    return res.status(404).json({
      status: 404,
      message: "Student not found",
      data: null
    });
  }

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body cannot be empty",
      data: null
    });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid input",
      data: validateStudent.errors
    });
  }

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim().toLowerCase();
  const courses = data.courses;

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({
      status: 400,
      message: "Name contains invalid characters",
      data: null
    });
  }

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
      data: null
    });
  }

  if (!Array.isArray(courses) || courses.length === 0 || !courses.every(c => typeof c === "string"
    && c.trim() !== "")) {
    return res.status(400).json({
      status: 400,
      message: "Courses must be a non-empty array of non-empty strings",
      data: null
    });
  }

  if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({
      status: 400,
      message: "Courses contain invalid characters",
      data: null
    });
  }

  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({
      status: 400,
      message: "Courses must not contain duplicates",
      data: null
    });
  }

  const emailUsedByAnother = students.some(
    (s, i) => s.email.toLowerCase() === trimmedEmail && i !== index
  );
  if (emailUsedByAnother) {
    return res.status(400).json({
      status: 400,
      message: "The email already exists",
      data: null
    });
  }

  students[index] = {
    id: students[index].id,
    name: trimmedName,
    email: trimmedEmail,
    courses,
  };

  WriteData(students);
  res.status(200).json({
    status: 200,
    message: "Student edited successfully",
    data: students[index]
  });
};

// PATCH actualizar parcialmente por id o email (query param)
exports.patchStudent = (req, res) => {
  const students = ReadData();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "Query param 'id' or 'email' is required",
      data: null
    });
  }

  let student;
  if (id) {
    student = students.find(s => s.id === id);
  } else if (email) {
    student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  if (!student) {
    return res.status(404).json({
      status: 404,
      message: "Student not found",
      data: null
    });
  }

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body cannot be empty",
      data: null
    });
  }

  let { name, email: newEmail, courses } = data;

  if (name !== undefined) {
    name = name.trim();
    if (name === "") {
      return res.status(400).json({
        status: 400,
        message: "Name cannot be empty",
        data: null
      });
    }
    if (!/^[\p{L} .'-]+$/u.test(name)) {
      return res.status(400).json({
        status: 400,
        message: "Name contains invalid characters",
        data: null
      });
    }
    student.name = name;
  }

  if (newEmail !== undefined) {
    newEmail = newEmail.trim().toLowerCase();
    if (newEmail === "") {
      return res.status(400).json({
        status: 400,
        message: "Email cannot be empty",
        data: null
      });
    }
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        data: null
      });
    }
    if (students.some(s => s.email.toLowerCase() === newEmail && s.id !== student.id)) {
      return res.status(400).json({
        status: 400,
        message: "This email is already registered",
        data: null
      });
    }
    student.email = newEmail;
  }

  if (courses !== undefined) {
    if (!Array.isArray(courses)) {
      return res.status(400).json({
        status: 400,
        message: "Courses must be an array of strings",
        data: null
      });
    }
    if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
      return res.status(400).json({
        status: 400,
        message: "All courses must be non-empty strings",
        data: null
      });
    }
    if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
      return res.status(400).json({
        status: 400,
        message: "Courses contain invalid characters",
        data: null
      });
    }
    if (hasDuplicateCourses(courses)) {
      return res.status(400).json({
        status: 400,
        message: "Courses must not contain duplicates",
        data: null
      });
    }
    student.courses = courses;
  }

  WriteData(students);
  res.status(200).json({
    status: 200,
    message: "Student updated successfully",
    data: student
  });
};

// DELETE estudiante por id o email (query param)
exports.deleteStudent = (req, res) => {
  let students = ReadData();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "Query param 'id' or 'email' is required",
      data: null
    });
  }

  let index = -1;
  if (id) {
    index = students.findIndex(s => s.id === id);
  } else if (email) {
    index = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  }

  if (index === -1) {
    return res.status(404).json({
      status: 404,
      message: "Student not found",
      data: null
    });
  }

  const deleted = students.splice(index, 1);
  WriteData(students);
  res.status(200).json({
    status: 200,
    message: "Student deleted",
    data: deleted[0]
  });
};

// GET estudiantes de un curso (por query param)
exports.getStudentsByCourse = (req, res) => {
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
  res.status(200).json({
    status: 200,
    message: "Students retrieved for course",
    data: enrolled
  });
};

// DELETE un curso de todos los estudiantes (por query param)
exports.deleteCourseFromAllStudents = (req, res) => {
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
      message: "Course not found in any student",
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
