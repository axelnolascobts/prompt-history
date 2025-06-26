const AJV = require("ajv");
const AJVFORMATS = require("ajv-formats");
const { readData } = require('./controllers-get.js');
const { writeData, nonDuplicateStudents, validateStudents } = require('./controllers-post.js');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/REST_API/data/db.json";

const AJV_VALIDATOR = new AJV({ allErrors: true });
AJVFORMATS(AJV_VALIDATOR);

const EDIT_COURSE_SCHEMA = {
  type: "object",
  properties: {
    course: { type: "string" },
    students: { type: "array", items: { "type": "string" } }
  },
  additionalProperties: false
};

const VALIDATE_COURSE = AJV_VALIDATOR.compile(EDIT_COURSE_SCHEMA );

function partialUpdateCourse (courseName, body) {

    const VALIDATE_SCHEMA = VALIDATE_COURSE(body);

    if (!VALIDATE_SCHEMA) {

        return {status: 400, message: "Invalid input format"};
        
    }

    let coursesData = readData();

    let course = coursesData.find(courseData => courseData.course.toLowerCase().trim() === courseName.toLowerCase().trim());

    let name = body.course ? body.course : courseName;
    let students = body.students ? body.students : course.course;

    if ( !course ) {

        return {status: 404, message: "Course not found"};

    } else if ( course.course !== name ) {

        return {status: 400, message: "Cannot change course name"};
    } else if ( !nonDuplicateStudents(students) ) {

        return {status: 400, message: "You cannot have duplicate students in the same class"};
    }

    let studentsList = validateStudents(courseName, body.students);

    if ( !studentsList ) {

        return {status: 400, message: "Some of the students were not found"};
    }

    let courseIndex = coursesData.findIndex(courseData => courseData.course.toLowerCase().trim() === courseName.toLowerCase().trim());

    coursesData[courseIndex].students = studentsList;

    writeData(coursesData);

    return { status: 200, data: course }

}

module.exports = { partialUpdateCourse }