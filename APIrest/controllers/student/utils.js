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
  return JSON.parse(fs.readFileSync(COURSE_PATH, "utf8"));
}

function writeCourses(data) {
  fs.writeFileSync(COURSE_PATH, JSON.stringify(data, null, 2));
}

function hasDuplicateCourses(courses) {
  return new Set(courses.map((c) => c.trim().toLowerCase())).size !== courses.length;
}

function checkCoursesExist(coursesArray, coursesData) {
  const missing = coursesArray.filter(
    (c) =>
      !coursesData.some(
        (course) => course.name.trim().toLowerCase() === c.trim().toLowerCase()
      )
  );
  return missing.length === 0 ? false : missing;
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

module.exports = {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  hasDuplicateCourses,
  checkCoursesExist,
  validateStudent,
  emailRegex,
  uuidv4,
};
