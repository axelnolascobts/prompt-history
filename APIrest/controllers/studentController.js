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

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({ message: "Invalid input", errors: validateStudent.errors });
  }

  if (students.some((s) => s.email.toLowerCase() === data.email.trim().toLowerCase())) {
    return res.status(400).json({ message: "The email already exists" });
  }

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

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ message: "Courses must be a non-empty array" });
  }

  if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
    return res.status(400).json({ message: "All courses must be non-empty strings" });
  }

  if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({ message: "Courses contain invalid characters" });
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

// PUT actualizar
exports.updateStudent = (req, res) => {
  const students = ReadData();
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({ message: "Invalid input", errors: validateStudent.errors });
  }

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim().toLowerCase();
  const courses = data.courses;

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({ message: "Name contains invalid characters" });
  }

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!Array.isArray(courses) || courses.length === 0 || !courses.every(c => typeof c === "string"
  && c.trim() !== "")) {
    return res.status(400).json({ message: "Courses must be a non-empty array of non-empty strings" });
  }

  if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({ message: "Courses contain invalid characters" });
  }

  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({ message: "Courses must not contain duplicates" });
  }

  const emailUsedByAnother = students.some(
    (s) => s.email.toLowerCase() === trimmedEmail && s.id !== req.params.id
  );
  if (emailUsedByAnother) {
    return res.status(400).json({ message: "The email already exists" });
  }

  students[index] = {
    id: req.params.id,
    name: trimmedName,
    email: trimmedEmail,
    courses,
  };

  WriteData(students);
  res.json(students[index]);
};

// PATCH actualizar parcialmente
exports.patchStudent = (req, res) => {
  const students = ReadData();
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  let { name, email, courses } = data;

  if (name !== undefined) {
    name = name.trim();
    if (name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    if (!/^[\p{L} .'-]+$/u.test(name)) {
      return res.status(400).json({ message: "Name contains invalid characters" });
    }
    student.name = name;
  }

  if (email !== undefined) {
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
    student.email = email;
  }

  if (courses !== undefined) {
    if (!Array.isArray(courses)) {
      return res.status(400).json({ message: "Courses must be an array of strings" });
    }
    if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
      return res.status(400).json({ message: "All courses must be non-empty strings" });
    }
    if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
      return res.status(400).json({ message: "Courses contain invalid characters" });
    }
    if (hasDuplicateCourses(courses)) {
      return res.status(400).json({ message: "Courses must not contain duplicates" });
    }
    student.courses = courses;
  }

  WriteData(students);
  res.json(student);
};

// DELETE
exports.deleteStudent = (req, res) => {
  const students = ReadData();
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }
  const deleted = students.splice(index, 1);
  WriteData(students);
  res.status(200).json({ message: "Student deleted", deleted: deleted[0] });
};

// UPDATE completo por email
exports.updateStudentByEmail = (req, res) => {
  const students = ReadData();
  const emailParam = req.params.email.toLowerCase();

  const index = students.findIndex(s => s.email.toLowerCase() === emailParam);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({ message: "Invalid input", errors: validateStudent.errors });
  }

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim().toLowerCase();
  const courses = data.courses;

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({ message: "Name contains invalid characters" });
  }

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!Array.isArray(courses) || courses.length === 0 || !courses.every(c => typeof c === "string" && c.trim() !== "")) {
    return res.status(400).json({ message: "Courses must be a non-empty array of non-empty strings" });
  }

  if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({ message: "Courses contain invalid characters" });
  }

  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({ message: "Courses must not contain duplicates" });
  }

  const emailUsedByAnother = students.some(
    (s, i) => s.email.toLowerCase() === trimmedEmail && i !== index
  );
  if (emailUsedByAnother) {
    return res.status(400).json({ message: "The email already exists" });
  }

  students[index] = {
    ...students[index],
    name: trimmedName,
    email: trimmedEmail,
    courses,
  };

  WriteData(students);
  res.json(students[index]);
};

// PATCH parcial por email
exports.patchStudentByEmail = (req, res) => {
  const students = ReadData();
  const emailParam = req.params.email.toLowerCase();

  const student = students.find(s => s.email.toLowerCase() === emailParam);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  let { name, email, courses } = data;

  if (name !== undefined) {
    name = name.trim();
    if (name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    if (!/^[\p{L} .'-]+$/u.test(name)) {
      return res.status(400).json({ message: "Name contains invalid characters" });
    }
    student.name = name;
  }

  if (email !== undefined) {
    email = email.trim().toLowerCase();
    if (email === "") {
      return res.status(400).json({ message: "Email cannot be empty" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (students.some(s => s.email.toLowerCase() === email && s.id !== student.id)) {
      return res.status(400).json({ message: "This email is already registered" });
    }
    student.email = email;
  }

  if (courses !== undefined) {
    if (!Array.isArray(courses)) {
      return res.status(400).json({ message: "Courses must be an array of strings" });
    }
    if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
      return res.status(400).json({ message: "All courses must be non-empty strings" });
    }
    if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
      return res.status(400).json({ message: "Courses contain invalid characters" });
    }
    if (hasDuplicateCourses(courses)) {
      return res.status(400).json({ message: "Courses must not contain duplicates" });
    }
    student.courses = courses;
  }

  WriteData(students);
  res.json(student);
};

// DELETE por email
exports.deleteStudentByEmail = (req, res) => {
  const students = ReadData();
  const emailParam = req.params.email.toLowerCase();

  const index = students.findIndex(s => s.email.toLowerCase() === emailParam);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deleted = students.splice(index, 1);
  WriteData(students);
  res.json({ message: "Student deleted", deleted: deleted[0] });
};

// Métodos para bloquear operaciones por nombre
exports.forbidOperationByName = (req, res) => {
  return res.status(400).json({ message: "This operation is only allowed by email or id" });
};
