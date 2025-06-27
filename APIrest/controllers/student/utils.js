const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const DBPATH = path.join(__dirname, "../../data/db.json");
const COURSEPATH = path.join(__dirname, "../../data/courses.json");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

function ReadData() {
  const data = fs.readFileSync(DBPATH, "utf8");
  return JSON.parse(data);
}

function WriteData(data) {
  fs.writeFileSync(DBPATH, JSON.stringify(data, null, 2));
}

function readCourses() {
  if (!fs.existsSync(COURSEPATH)) {
    fs.writeFileSync(COURSEPATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(COURSEPATH, "utf8");
  return JSON.parse(data);
}

function writeCourses(courses) {
  fs.writeFileSync(COURSEPATH, JSON.stringify(courses, null, 2));
}

function checkCoursesExist(coursesArray, coursesData) {
  const normalizedInput = coursesArray.map(c => c.trim().toLowerCase());
  for (const c of normalizedInput) {
    if (!coursesData.some(course => course.name.toLowerCase() === c)) {
      return c;
    }
  }
  return null;
}

module.exports = {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  checkCoursesExist,
  hasDuplicateCourses,
  validateStudent,
  emailRegex,
  uuidv4
};