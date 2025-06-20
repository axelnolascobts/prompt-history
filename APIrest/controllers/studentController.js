const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });

addFormats(ajv);

const DBPATH = path.join(__dirname, "../data/db.json");

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
  if (!students) {
    return res.status(404).json({ message: "Students not found" });
  }
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

// POST crear
exports.createStudent = (req, res) => {
  const students = ReadData();
  const data = req.body;

  if (!validateStudent(data)) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: validateStudent.errors });
  }

  if (students.some((s) => s.email === data.email)) {
    return res.status(400).json({ message: "The email already exists" });
  }

  const newStudent = {
    id: uuidv4(),
    name: data.name.trim(),
    email: data.email.trim(),
    courses: data.courses,
  };

 
    if (typeof newStudent.name === "string") {
    newStudent.name = newStudent.name.trim();
    if (newStudent.name === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
  }


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
    return res
      .status(400)
      .json({ message: "Invalid input", errors: validateStudent.errors });
  }

  const currentStudent = students[index];

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim();

  if (trimmedName === "") {
    return res.status(400).json({ message: "Name cannot be empty" });
  }

  const isSameName = currentStudent.name === trimmedName;
  const isSameEmail = currentStudent.email === trimmedEmail;
  const isSameCourses =
    JSON.stringify(currentStudent.courses) === JSON.stringify(data.courses);

  if (isSameName || isSameEmail || isSameCourses) {
    return res.status(400).json({
      message:
        "All fields (name, email, and courses) must be different from the current values",
    });
  }

  const emailUsedByAnother = students.some(
    (s) => s.email === trimmedEmail && s.id !== currentStudent.id
  );
  if (emailUsedByAnother) {
    return res.status(400).json({ message: "The email already exists" });
  }

  students[index] = {
    id: currentStudent.id,
    name: trimmedName,
    email: trimmedEmail,
    courses: data.courses,
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
  }

  if (typeof email === "string") {
    email = email.trim();
    if (email === "") {
      return res.status(400).json({ message: "Email cannot be empty" });
    }
    if (students.some((s) => s.email === email && s.id !== student.id)) {
      return res
        .status(400)
        .json({ message: "This email is already registered" });
    }
  }

  if (courses && !Array.isArray(courses)) {
    return res.status(400).json({ message: "Courses must be an array" });
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
