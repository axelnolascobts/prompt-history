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

// GET todos
exports.getAllStudents = (req, res) => {
  const students = ReadData();
  res.json(students);
};

// GET por ID
exports.getStudentsById = (req, res) => {
  const students = ReadData();
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
};

// GET por name
exports.getStudentByName = (req, res) => {
  const students = ReadData();
  const nameParam = req.params.name.toLowerCase();

  const matches = students.filter((s) =>
    s.name.toLowerCase().includes(nameParam)
  );

  if (matches.length === 0) {
    return res.status(404).json({ message: "No students found with that name" });
  }

  res.json(matches);
};

// GET por email
exports.getStudentByEmail = (req, res) => {
  const students = ReadData();
  const emailParam = req.params.email.toLowerCase();

  const match = students.find((s) => s.email.toLowerCase() === emailParam);

  if (!match) {
    return res.status(404).json({ message: "No student found with that email" });
  }

  res.json(match);
};

// POST crear
exports.createStudent = (req, res) => {
  const students = ReadData();
  const data = req.body;

  if (!validateStudent(data)) {
    return res.status(400).json({ message: "Invalid input", errors: validateStudent.errors });
  }

  if (students.some((s) => s.email.toLowerCase() === data.email.trim().toLowerCase())) {
    return res.status(400).json({ message: "The email already exists" });
  }

  // Validaciones adicionales

  const trimmedName = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const courses = data.courses;

  if (trimmedName === "") {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({ message: "Name contains invalid characters" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
    return res.status(400).json({ message: "All courses must be non-empty strings" });
  }

  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({ message: "Courses must not contain duplicates" });
  }

  const newStudent = {
    id: uuidv4(),
    name: trimmedName,
    email,
    courses,
  };

  students.push(newStudent);
  WriteData(students);
  res.status(201).json(newStudent);
};

// PUT actualizar completamente
exports.updateStudent = (req, res) => {
  const students = ReadData();
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const data = req.body;

  if (!validateStudent(data)) {
    return res.status(400).json({ message: "Invalid input", errors: validateStudent.errors });
  }

  const currentStudent = students[index];

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim().toLowerCase();
  const courses = data.courses;

  if (trimmedName === "") {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({ message: "Name contains invalid characters" });
  }

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!courses.every((c) => typeof c === "string" && c.trim() !== "")) {
    return res.status(400).json({ message: "All courses must be non-empty strings" });
  }

  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({ message: "Courses must not contain duplicates" });
  }

  const emailUsedByAnother = students.some(
    (s) => s.email.toLowerCase() === trimmedEmail && s.id !== currentStudent.id
  );
  if (emailUsedByAnother) {
    return res.status(400).json({ message: "The email already exists" });
  }

  const isSameName = currentStudent.name === trimmedName;
  const isSameEmail = currentStudent.email.toLowerCase() === trimmedEmail;
  const isSameCourses = JSON.stringify(currentStudent.courses) === JSON.stringify(courses);

  if (isSameName && isSameEmail && isSameCourses) {
    return res.status(400).json({
      message: "All fields (name, email, and courses) must be different from the current values",
    });
  }

  students[index] = {
    id: currentStudent.id,
    name: trimmedName,
    email: trimmedEmail,
    courses,
  };

  WriteData(students);
  res.json(students[index]);
};

// PATCH modificar parcialmente
exports.patchStudent = (req, res) => {
  const students = ReadData();
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  let { name, email, courses } = req.body;

  if (typeof name === "string") {
    name = name.trim();
    if (name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    if (!/^[\p{L} .'-]+$/u.test(name)) {
      return res.status(400).json({ message: "Name contains invalid characters" });
    }
  }

  if (typeof email === "string") {
    email = email.trim().toLowerCase();
    if (email === "") {
      return res.status(400).json({ message: "Email cannot be empty" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (students.some((s) => s.email === email && s.id !== student.id)) {
      return res.status(400).json({ message: "This email is already registered" });
    }
  }

  if (courses !== undefined) {
    if (!Array.isArray(courses)) {
      return res.status(400).json({ message: "Courses must be an array of strings" });
    }

    if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
      return res.status(400).json({ message: "All courses must be non-empty strings" });
    }

    if (!courses.every(c => /^[\p{L}\d ]+$/u.test(c.trim()))) {
      return res.status(400).json({ message: "The course name contains invalid characters" });
    }

    if (hasDuplicateCourses(courses)) {
      return res.status(400).json({ message: "Courses must not contain duplicates" });
    }
  }

  if (name) student.name = name;
  if (email) student.email = email;
  if (courses) student.courses = courses;

  WriteData(students);
  res.json(student);
};

// DELETE
exports.deleteStudent = (req, res) => {
  let students = ReadData();
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deleted = students.splice(index, 1);
  WriteData(students);
  res.status(200).json({ message: "Student deleted", deleted: deleted[0] });
};
