const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();
require("ajv-formats")(ajv);
const { v4: uuidv4 } = require("uuid");

const DATA_DIR = path.join(__dirname, "../../data");
const STUDENT_PATH = path.join(DATA_DIR, "db.json");
const COURSE_PATH = path.join(DATA_DIR, "courses.json");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ReadData() {
  return JSON.parse(fs.readFileSync(STUDENT_PATH, "utf8"));
}

function WriteData(data) {
  fs.writeFileSync(STUDENT_PATH, JSON.stringify(data, null, 2));
}

function readCourses() {
  try {
    const data = fs.readFileSync(COURSE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeCourses(data) {
  fs.writeFileSync(COURSE_PATH, JSON.stringify(data, null, 2));
}

function hasDuplicateCourses(courses) {
  return new Set(courses.map((c) => c.trim().toLowerCase())).size !== courses.length;
}

function checkCoursesExist(coursesArray, coursesData) {
  if (!Array.isArray(coursesArray)) return [];
  if (!Array.isArray(coursesData)) coursesData = [];
  const missing = coursesArray.filter(
    (c) =>
      !coursesData.some(
        (course) =>
          course &&
          typeof course.name === "string" &&
          course.name.toLowerCase() === c.trim().toLowerCase()
      )
  );
  return missing;
}

const studentSchema = {
  type: "object",
  required: ["name", "email", "courses"],
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    courses: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
  },
  additionalProperties: false,
};

const validateStudent = ajv.compile(studentSchema);

function validateStudentData(student, students, coursesData, currentId = null) {
  const valid = validateStudent(student);
  if (!valid) {
    let message = ajv.errorsText(validateStudent.errors);
    message = message.replace(/data[./]/g, "");
    return { valid: false, message };
  }

  // Email duplicado
  if (
    students.some(
      s =>
        s.email.toLowerCase() === student.email.trim().toLowerCase() &&
        s.id !== currentId
    )
  ) {
    return { valid: false, message: "The email already exists" };
  }

  // Duplicados en cursos
  if (hasDuplicateCourses(student.courses)) {
    return { valid: false, message: "Courses must not contain duplicates" };
  }

  // Cursos vacíos or no string
  if (student.courses.some(c => typeof c !== "string" || c.trim() === "")) {
    return { valid: false, message: "All courses must be non-empty strings" };
  }

  // Cursos inexistentes
  const missing = checkCoursesExist(student.courses, coursesData);
  if (missing.length > 0) {
    return { valid: false, message: `Course(s) not found: ${missing.join(", ")}` };
  }

  return { valid: true };
}

module.exports = {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  hasDuplicateCourses,
  checkCoursesExist,
  validateStudent: validateStudentData,
  emailRegex,
  uuidv4,
};
