const fs = require("fs");
const Ajv = require("ajv");
const ajv = new Ajv();
require("ajv-formats")(ajv); // <-- para formatos como "email"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ReadData() {
  return JSON.parse(fs.readFileSync("students.json", "utf8"));
}

function WriteData(data) {
  fs.writeFileSync("students.json", JSON.stringify(data, null, 2));
}

function hasDuplicateCourses(courses) {
  return new Set(courses.map((c) => c.trim().toLowerCase())).size !== courses.length;
}

function checkCoursesExist(courses, coursesData) {
  const notFound = courses.filter((courseName) =>
    !coursesData.some((c) => c.name === courseName)
  );
  return notFound.length ? notFound : false;
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
  hasDuplicateCourses,
  checkCoursesExist,
  validateStudent,
  emailRegex,
};
