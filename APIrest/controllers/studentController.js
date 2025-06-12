const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { search } = require("../routes/studentRoutes");

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

// GET students
exports.getAllStudents = (req, res) => {
  const students = ReadData();
    if (!students) {
    return res.status(404).json({ message: "Students not found" });
  }
  res.json(students);
};

// GET by ID
exports.getStudentsById = (req, res) => {
  const students = ReadData();
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
};

// POST
exports.createStudent = (req, res) => {
  const students = ReadData();
  const { name, email, courses } = req.body;

  if (!name || !email || !name.trim() || !email.trim()) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  if (students.some((s) => s.email === email)) {
    return res.status(400).json({ message: "The email already exists" });
  }
  if(!Array.isArray(courses)) {
    return res.status(400).json({message: "courses must be an array '[]'"})
  }

  const newStudent = {
    id: uuidv4(),
    name,
    email,
    courses: courses || [],
  };

  students.push(newStudent);
  WriteData(students);
  res.status(201).json(newStudent);
};

// PUT
exports.updateStudent = (req, res) => {
  const students = ReadData();
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, email, courses } = req.body;

  if (typeof name !== 'string' || name.trim()=== '' ||
  typeof email !== 'string' || email.trim()=== '' || !Array.isArray(courses)) {
    return res.status(400).json({ message: "PUT request must be replace: name, email and courses"})
  }

  const trimName = name.trim();
  const trimEmail = email.trim();
  const currentStudent = students[index];
  const emailExist = students.some((s, i) => s.email === trimEmail && i !== index);
  
  if (emailExist) {
    return res.status(400).json({ message: "The email already is used"})
  }

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

    if(!Array.isArray(courses)) {
      return res.status(400).json({message: "courses must be an array '[]'"})
  }

    const sameName = currentStudent.name === trimName;
    const sameEmail = currentStudent.email === trimEmail;
    const sameCourses = JSON.stringify(currentStudent.courses) === JSON.stringify(courses)

    if(sameName || sameEmail || sameCourses) {
      return res.status(400).json({ message:
         "1 or more data is the same, please insert different data"})
    }

  students[index] = {
    id: students[index].id,
    name: trimName,
    email: trimEmail ,
    courses: courses || [],
  };
  WriteData(students);
  res.json(students[index]);
};

// PATCH
exports.patchStudent = (req, res) => {
  const students = ReadData();
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  let { name, email, courses } = req.body;

  if(typeof name === 'string') {
    name = name.trim();
    if (name === '') {
        return res.status(400).json({message: "name cannot be empty"})
    }
  }

    if(typeof email === 'string') {
    email = email.trim();
    if (email === '') {
        return res.status(400).json({message: "email cannot be empty"})
    }
  }

  if (email && students.some((s) => s.email === email && s.id !== student.id)) {
    return res
      .status(400)
      .json({ message: "This email is already registered" });
  }
    if(!Array.isArray(courses)) {
      return res.status(400).json({message: "courses must be an array '[]'"})
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

  students.splice(index, 1);
  WriteData(students);
  res.status(200).json({ message: "Student deleted"});
};
